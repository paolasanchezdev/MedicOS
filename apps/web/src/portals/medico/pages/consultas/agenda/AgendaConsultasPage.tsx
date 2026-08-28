// apps/web/src/portals/medico/pages/consultas/agenda/AgendaConsultasPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgendaHeader } from './components/AgendaHeader';
import { AgendaSummary } from './components/AgendaSummary';
import { AgendaFilters } from './components/AgendaFilters';
import { ConsultaAgendaList } from './components/ConsultaAgendaList';
import { AgendaPatientModal } from './components/AgendaPatientModal';
import type { AgendaItem } from './components/ConsultaAgendaCard';

export default function AgendaConsultasPage() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [selectedOrigin, setSelectedOrigin] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedPatientModal, setSelectedPatientModal] = useState<AgendaItem | null>(null);

    const [appointments] = useState<AgendaItem[]>([
        {
            id: 'apt-001',
            time: '08:00 AM',
            patientName: 'María López Hernández',
            patientId: 'pat-101',
            origin: 'CITA',
            status: 'PENDING',
            reason: 'Control de presión arterial y seguimiento crónico.',
        },
        {
            id: 'apt-002',
            time: '08:30 AM',
            patientName: 'Carlos Hernández',
            patientId: 'pat-102',
            origin: 'BRIGADA',
            status: 'PENDING',
            reason: 'Derivación de brigada médica comunitaria.',
        },
        {
            id: 'apt-003',
            time: '09:00 AM',
            patientName: 'Ana García',
            patientId: 'pat-103',
            origin: 'CITA',
            status: 'WAITING',
            reason: 'Evaluación general y sintomatología febril.',
        },
    ]);

    const handleStartConsultation = (id: string) => {
        navigate(`/medico/consultas/nueva?appointmentId=${id}`);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedStatus('ALL');
        setSelectedOrigin('ALL');
    };

    const hasActiveFilters = searchTerm !== '' || selectedStatus !== 'ALL' || selectedOrigin !== 'ALL';

    const filteredAppointments = appointments.filter((item) => {
        const matchesSearch =
            item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.patientId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
        const matchesOrigin = selectedOrigin === 'ALL' || item.origin === selectedOrigin;

        return matchesSearch && matchesStatus && matchesOrigin;
    });

    const totalConsultas = appointments.length;
    const pendientesCount = appointments.filter((i) => i.status === 'PENDING' || i.status === 'WAITING').length;
    const enAtencionCount = appointments.filter((i) => i.status === 'IN_PROGRESS').length;
    const completadasCount = appointments.filter((i) => i.status === 'COMPLETED').length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            <AgendaHeader dateLabel={selectedDate} />

            <AgendaSummary
                total={totalConsultas}
                pending={pendientesCount}
                inProgress={enAtencionCount}
                completed={completadasCount}
            />

            <AgendaFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedOrigin={selectedOrigin}
                onOriginChange={setSelectedOrigin}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />

            <ConsultaAgendaList
                items={filteredAppointments}
                onViewDetails={(item) => setSelectedPatientModal(item)}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {/* Modal de Detalles del Paciente */}
            <AgendaPatientModal
                item={selectedPatientModal}
                onClose={() => setSelectedPatientModal(null)}
                onStartConsultation={handleStartConsultation}
            />
        </div>
    );
}