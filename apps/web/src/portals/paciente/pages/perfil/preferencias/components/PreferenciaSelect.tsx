// =========================================================================
// ARCHIVO: PreferenciaSelect.tsx
// DESCRIPCIÓN: Selector segmentado táctil estilo iOS.
// =========================================================================


export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface PreferenciaSelectProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
}

export function PreferenciaSelect<T extends string>({
  value,
  options,
  onChange,
}: PreferenciaSelectProps<T>) {
  return (
    <div className="inline-flex rounded-xl bg-[#EEF7F8] p-1 border border-[#D3E8EC]">
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isSelected
                ? 'bg-white text-[#166E7A] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default PreferenciaSelect;