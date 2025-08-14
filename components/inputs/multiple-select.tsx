import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface Option {
  label: string;
  value: number;
}

interface MultiSelectDropdownProps {
  label: string;
  options: Option[];
  value: number[];
  onChange: (selected: number[]) => void;
  placeholder?: string;
  error?: any;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue: number) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: number) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const getSelectedLabels = () => {
    return value.map(val => options.find(opt => opt.value === val)?.label).filter(Boolean);
  };

  const selectedLabels = getSelectedLabels();

  const getDisplayText = () => {
    if (selectedLabels.length === 0) return placeholder;
    if (selectedLabels.length === 1) return selectedLabels[0];
    return `${selectedLabels.length} selected`;
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="text-[#3A3A3A] text-xs font-medium">
        {label}
      </label>
      
      <div className="relative">
        {/* Main dropdown button */}
        <div
          className={`"block w-full outline-none  py-[10px] text-[#A8A8A8] sm:text-sm sm:leading-6 pl-2.5 rounded-[10px] border   min-h-[30px] ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1 flex-1 mr-2">
              {selectedLabels.length > 0 ? (
                selectedLabels.map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center text-sm  rounded-md"
                  >
                    {label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const optionValue = options.find(opt => opt.label === label)?.value;
                        if (optionValue !== undefined) {
                          removeOption(optionValue);
                        }
                      }}

                    >,
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
            <ChevronDown 
              size={20} 
              className={`text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center transition-colors ${
                  value.includes(option.value) ? 'bg-blue-50' : ''
                }`}
                onClick={() => toggleOption(option.value)}
              >
                <div className="flex items-center w-full">
                  {/* Custom checkbox */}
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                    value.includes(option.value) 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {value.includes(option.value) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`${value.includes(option.value) ? 'text-[#3A3A3A] font-[400]' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default MultiSelectDropdown;