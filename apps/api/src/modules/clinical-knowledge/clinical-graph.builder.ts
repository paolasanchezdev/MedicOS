// =========================================================================
// ARCHIVO: apps/api/src/modules/clinical-knowledge/clinical-graph.builder.ts
// DESCRIPCIÓN: Constructor del Grafo Clínico con normalización integral
//              de DUI y Grupo Sanguíneo vinculados al nodo central del paciente.
// =========================================================================

import type {
  ClinicalGraphNode,
  ClinicalGraphEdge,
  ClinicalGraphResponse,
  ClinicalNodeType,
} from './clinical-knowledge.types.js';

const translateBloodType = (type?: string): string => {
  if (!type || type === 'UNKNOWN') return 'No determinado';
  const map: Record<string, string> = {
    A_POSITIVE: 'A Positivo (A+)',
    A_NEGATIVE: 'A Negativo (A-)',
    B_POSITIVE: 'B Positivo (B+)',
    B_NEGATIVE: 'B Negativo (B-)',
    O_POSITIVE: 'O Positivo (O+)',
    O_NEGATIVE: 'O Negativo (O-)',
    AB_POSITIVE: 'AB Positivo (AB+)',
    AB_NEGATIVE: 'AB Negativo (AB-)',
  };
  return map[type] || type.replace(/_/g, ' ');
};

const translateHabitType = (type: string): string => {
  const map: Record<string, string> = {
    WATER: 'Consumo de agua',
    SLEEP: 'Horas de sueño',
    MINDFULNESS: 'Bienestar y relajación',
    ACTIVITY: 'Actividad física',
    NUTRITION: 'Alimentación',
    TOBACCO: 'Hábito de tabaco',
    ALCOHOL: 'Consumo de alcohol',
  };
  return map[type] || type;
};

export class ClinicalGraphBuilder {
  static build(patientData: any, requestingRole: string): ClinicalGraphResponse {
    const nodesMap = new Map<string, ClinicalGraphNode>();
    const edges: ClinicalGraphEdge[] = [];
    let hasCriticalAlerts = false;

    const addNode = (node: ClinicalGraphNode) => {
      if (!nodesMap.has(node.id)) {
        nodesMap.set(node.id, node);
      }
    };

    const addEdge = (edge: ClinicalGraphEdge) => {
      if (!edges.some((e) => e.id === edge.id)) {
        edges.push(edge);
      }
    };

    const patientNodeId = `patient-${patientData.id}`;
    const cr = patientData.clinicalRecord;
    const humanBlood = cr ? translateBloodType(cr.bloodType) : 'No determinado';
    const cleanDui = patientData.dui?.trim() || null;

    // 1. Nodo Central: Paciente (contiene tanto DUI como Grupo Sanguíneo)
    addNode({
      id: patientNodeId,
      type: 'PATIENT',
      label: `${patientData.firstName} ${patientData.lastName}`,
      sublabel: cleanDui ? `DUI: ${cleanDui}` : 'DUI: No registrado',
      status: patientData.syncStatus,
      category: 'core',
      provenance: {
        model: 'Patient',
        recordId: patientData.id,
        timestamp: patientData.createdAt.toISOString(),
        originDeviceId: patientData.originDeviceId || 'SERVER_CENTRAL',
      },
      metadata: {
        fullName: `${patientData.firstName} ${patientData.lastName}`,
        dui: cleanDui,
        bloodType: humanBlood !== 'No determinado' ? humanBlood : null,
        sex: patientData.sex === 'FEMALE' ? 'Femenino' : patientData.sex === 'MALE' ? 'Masculino' : 'Otro',
        dateOfBirth: patientData.dateOfBirth?.toISOString(),
        phone: patientData.phone,
        address: patientData.address,
        emergencyName: patientData.emergencyName,
        emergencyPhone: patientData.emergencyPhone,
      },
    });

    // 2. Expediente Base y Alergias
    if (cr) {
      const recordNodeId = `cr-${cr.id}`;

      addNode({
        id: recordNodeId,
        type: 'CLINICAL_RECORD',
        label: 'Expediente Base',
        sublabel: `Grupo: ${humanBlood}`,
        category: 'core',
        provenance: {
          model: 'ClinicalRecord',
          recordId: cr.id,
          timestamp: cr.createdAt.toISOString(),
          originDeviceId: cr.originDeviceId || 'SERVER_CENTRAL',
        },
        metadata: {
          bloodType: humanBlood,
          familyHistory: cr.familyHistory,
          surgicalHistory: cr.surgicalHistory,
        },
      });

      addEdge({
        id: `edge-${patientNodeId}-${recordNodeId}`,
        source: patientNodeId,
        target: recordNodeId,
        relation: 'HAS_RECORD',
        label: 'Expediente Base',
      });

      if (cr.observations) {
        try {
          const parsed = JSON.parse(cr.observations);
          if (parsed && typeof parsed.allergies === 'string' && parsed.allergies.trim()) {
            const rawAllergies = parsed.allergies.trim();
            const isNegative =
              rawAllergies.toLowerCase().includes('ningun') ||
              rawAllergies.toLowerCase().includes('niega');

            if (!isNegative) {
              const allergyItems = rawAllergies.split(/[,;\n]+/).map((s: string) => s.trim()).filter(Boolean);
              allergyItems.forEach((allergyName: string, index: number) => {
                const allergyId = `allergy-${cr.id}-${index}`;
                hasCriticalAlerts = true;

                addNode({
                  id: allergyId,
                  type: 'ALLERGY',
                  label: allergyName,
                  sublabel: 'Alergia documentada',
                  status: 'ACTIVE',
                  category: 'clinical',
                  provenance: {
                    model: 'ClinicalRecord.observations',
                    recordId: cr.id,
                    timestamp: cr.updatedAt.toISOString(),
                    originDeviceId: cr.lastModifiedByDeviceId || 'SERVER_CENTRAL',
                  },
                  metadata: { substance: allergyName },
                });

                addEdge({
                  id: `edge-${patientNodeId}-${allergyId}`,
                  source: patientNodeId,
                  target: allergyId,
                  relation: 'HAS_ALLERGY',
                  label: 'Alergia Activa',
                  weight: 2,
                });
              });
            }
          }
        } catch {
          // Ignorar si no es JSON válido
        }
      }
    }

    // 3. Consultas Médicas, Controles Prenatales y Vacunas
    if (Array.isArray(patientData.consultations)) {
      patientData.consultations.forEach((consultation: any) => {
        const rawComplaint = consultation.chiefComplaint || 'Consulta Médica';
        const lowerComplaint = rawComplaint.toLowerCase();
        const lowerDesc = (consultation.diagnosisDesc || '').toLowerCase();

        let nodeType: ClinicalNodeType = 'CONSULTATION';
        let edgeLabel = 'Atención Médica';
        let displayLabel = rawComplaint;

        if (lowerComplaint.includes('vacun') || lowerComplaint.includes('saramp') || lowerDesc.includes('vacun')) {
          nodeType = 'VACCINATION';
          edgeLabel = 'Inmunización';
          displayLabel = rawComplaint.replace(/\[VACUNACION\]/gi, '').trim() || 'Inmunización';
        } else if (
          lowerComplaint.includes('trimestre') ||
          lowerComplaint.includes('prenatal') ||
          lowerComplaint.includes('fetal') ||
          lowerComplaint.includes('embarazo') ||
          lowerDesc.includes('gest')
        ) {
          nodeType = 'PRENATAL_CONTROL';
          edgeLabel = 'Control Prenatal';
          displayLabel = rawComplaint;
        }

        const consultNodeId = `consultation-${consultation.id}`;

        addNode({
          id: consultNodeId,
          type: nodeType,
          label: displayLabel,
          sublabel: new Date(consultation.consultationDate).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          status: consultation.status,
          category: 'encounter',
          provenance: {
            model: 'Consultation',
            recordId: consultation.id,
            timestamp: consultation.consultationDate.toISOString(),
            authorId: consultation.doctorId,
            originDeviceId: consultation.originDeviceId || 'SERVER_CENTRAL',
          },
          metadata: {
            chiefComplaint: displayLabel,
            physicalExam: consultation.physicalExam,
            diagnosisDesc: consultation.diagnosisDesc,
            treatmentPlan: consultation.treatmentPlan,
            consultationDate: consultation.consultationDate.toISOString(),
            doctorName: consultation.doctor
              ? `${consultation.doctor.firstName} ${consultation.doctor.lastName}`
              : 'Personal Médico Titular',
          },
        });

        addEdge({
          id: `edge-${patientNodeId}-${consultNodeId}`,
          source: patientNodeId,
          target: consultNodeId,
          relation: 'ATTENDED_IN',
          label: edgeLabel,
        });

        // Relación con Brigada
        if (consultation.brigade) {
          const b = consultation.brigade;
          const brigadeNodeId = `brigade-${b.id}`;

          addNode({
            id: brigadeNodeId,
            type: 'BRIGADE',
            label: b.name,
            sublabel: `${b.municipality}, ${b.department}`,
            status: b.status,
            category: 'context',
            provenance: {
              model: 'Brigade',
              recordId: b.id,
              timestamp: b.createdAt.toISOString(),
              originDeviceId: b.originDeviceId || 'SERVER_CENTRAL',
            },
            metadata: {
              name: b.name,
              department: b.department,
              municipality: b.municipality,
            },
          });

          addEdge({
            id: `edge-${consultNodeId}-${brigadeNodeId}`,
            source: consultNodeId,
            target: brigadeNodeId,
            relation: 'EXECUTED_IN',
            label: 'Sede Territorial',
          });
        }

        // Diagnósticos de la consulta
        if (Array.isArray(consultation.diagnoses)) {
          consultation.diagnoses.forEach((diag: any) => {
            const diagNodeId = `diagnosis-${diag.id}`;

            addNode({
              id: diagNodeId,
              type: 'DIAGNOSIS',
              label: diag.description,
              sublabel: diag.code ? `CIE-10: ${diag.code}` : 'Diagnóstico Clínico',
              status: diag.status,
              category: 'clinical',
              provenance: {
                model: 'Diagnosis',
                recordId: diag.id,
                timestamp: diag.diagnosedAt.toISOString(),
                originDeviceId: diag.originDeviceId || 'SERVER_CENTRAL',
              },
              metadata: {
                code: diag.code,
                description: diag.description,
                status: diag.status,
                notes: diag.notes,
              },
            });

            addEdge({
              id: `edge-${consultNodeId}-${diagNodeId}`,
              source: consultNodeId,
              target: diagNodeId,
              relation: 'DIAGNOSED',
              label: 'Diagnóstico',
              weight: 2,
            });
          });
        }

        // Signos Vitales vinculados a la consulta
        if (Array.isArray(consultation.vitalSigns)) {
          consultation.vitalSigns.forEach((vitals: any) => {
            const vitalsNodeId = `vitals-${vitals.id}`;

            addNode({
              id: vitalsNodeId,
              type: 'VITAL_SIGN',
              label: `PA: ${vitals.systolic}/${vitals.diastolic} mmHg`,
              sublabel: `Pulso: ${vitals.heartRate} lpm · SpO2: ${vitals.oxygenSat}%`,
              category: 'clinical',
              provenance: {
                model: 'VitalSigns',
                recordId: vitals.id,
                timestamp: vitals.createdAt.toISOString(),
                originDeviceId: vitals.originDeviceId || 'SERVER_CENTRAL',
              },
              metadata: {
                systolic: vitals.systolic,
                diastolic: vitals.diastolic,
                heartRate: vitals.heartRate,
                temperature: vitals.temperature,
                oxygenSat: vitals.oxygenSat,
                weight: vitals.weight,
                height: vitals.height,
              },
            });

            addEdge({
              id: `edge-${consultNodeId}-${vitalsNodeId}`,
              source: consultNodeId,
              target: vitalsNodeId,
              relation: 'RECORDED_VITALS',
              label: 'Signos',
            });
          });
        }
      });
    }

    // 4. Hábitos de Salud
    if (Array.isArray(patientData.lifestyleHabitLogs) && patientData.lifestyleHabitLogs.length > 0) {
      const habitHubId = `habit-hub-${patientData.id}`;

      addNode({
        id: habitHubId,
        type: 'LIFESTYLE_HABIT',
        label: 'Hábitos de Salud y Autocuidado',
        sublabel: `${patientData.lifestyleHabitLogs.length} registros`,
        category: 'clinical',
        provenance: {
          model: 'LifestyleHabitLog',
          recordId: patientData.lifestyleHabitLogs[0]?.id || patientData.id,
          timestamp: patientData.lifestyleHabitLogs[0]?.createdAt.toISOString() || new Date().toISOString(),
          originDeviceId: patientData.originDeviceId || 'SERVER_CENTRAL',
        },
        metadata: {
          totalLogs: patientData.lifestyleHabitLogs.length,
        },
      });

      addEdge({
        id: `edge-${patientNodeId}-${habitHubId}`,
        source: patientNodeId,
        target: habitHubId,
        relation: 'LOGGED_HABIT',
        label: 'Monitoreo de Hábitos',
      });

      patientData.lifestyleHabitLogs.forEach((habit: any) => {
        const habitNodeId = `habit-${habit.id}`;
        const habitName = translateHabitType(habit.habitType);

        addNode({
          id: habitNodeId,
          type: 'LIFESTYLE_HABIT',
          label: `${habitName}: ${habit.value} ${habit.unit}`,
          sublabel: new Date(habit.loggedDate).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          category: 'clinical',
          provenance: {
            model: 'LifestyleHabitLog',
            recordId: habit.id,
            timestamp: habit.createdAt.toISOString(),
            originDeviceId: habit.originDeviceId || 'SERVER_CENTRAL',
          },
          metadata: {
            habitType: habitName,
            value: habit.value,
            unit: habit.unit,
            loggedDate: habit.loggedDate,
            notes: habit.notes,
          },
        });

        addEdge({
          id: `edge-${habitHubId}-${habitNodeId}`,
          source: habitHubId,
          target: habitNodeId,
          relation: 'LOGGED_HABIT',
          label: 'Detalle',
        });
      });
    }

    // Poda RBAC en Servidor
    const allowedNodes: ClinicalGraphNode[] = [];
    nodesMap.forEach((node) => {
      let isPermitted = true;
      if (requestingRole === 'BRIGADISTA' && (node.type === 'ANALYTE_RESULT' || node.type === 'IMAGING_STUDY')) {
        isPermitted = false;
      }
      if (requestingRole === 'PATIENT' && node.type === 'CONSULTATION') {
        delete node.metadata.physicalExam;
      }
      if (isPermitted) allowedNodes.push(node);
    });

    const allowedNodeIds = new Set(allowedNodes.map((n) => n.id));
    const validEdges = edges.filter(
      (edge) => allowedNodeIds.has(edge.source) && allowedNodeIds.has(edge.target)
    );

    return {
      patientId: patientData.id,
      generatedAt: new Date().toISOString(),
      nodeCount: allowedNodes.length,
      edgeCount: validEdges.length,
      nodes: allowedNodes,
      edges: validEdges,
      metadata: {
        requestedByRole: requestingRole,
        totalNodesGenerated: nodesMap.size,
        totalEdgesGenerated: edges.length,
        prunedNodesCount: nodesMap.size - allowedNodes.length,
        hasCriticalAlerts,
      },
    };
  }
}