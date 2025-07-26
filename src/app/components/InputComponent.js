import { ChevronDown } from "lucide-react";
import React from "react";

export default function InputComponent({ field, value, onChange }) {
  return (
    <div className="text-gray-800 mb-4">
      {/* For non-checkbox types */}
      {field.type !== "checkbox" &&
        field.type !== "multi-checkbox" &&
        field.type !== "repeater" && (
          <>
            <label className="text-gray-800 block mb-1 font-medium">
              {field.label}
            </label>

            {field.type === "select" && (
              <select
                value={value || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                disabled={field.disabled}
                className="w-full border border-slate-300 text-gray-800 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="">Select</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "multi-select" && (
              <fieldset disabled={field.disabled} className="w-full">
                <div className="w-full text-sm">
                  {/* Custom Underlined Dropdown */}
                  <div className="relative">
                    <select
                      value=""
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (
                          selectedValue &&
                          !(value || []).includes(selectedValue)
                        ) {
                          onChange(field.name, [
                            ...(value || []),
                            selectedValue,
                          ]);
                        }
                      }}
                      className="w-full appearance-none border-0 border-b border-black bg-transparent px-1 py-2 text-gray-900 focus:outline-none focus:ring-0 focus:border-black"
                    >
                      <option value="">Select option</option>
                      {field.options
                        .filter((opt) => !(value || []).includes(opt.value))
                        .map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                    </select>
                    {/* Dropdown arrow */}
                    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      <ChevronDown size={20}/>
                    </div>
                  </div>

                  {/* Selected Items */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(value || []).map((val) => {
                      const label =
                        field.options.find((opt) => opt.value === val)?.label ||
                        val;
                      return (
                        <span
                          key={val}
                          className="bg-black text-white px-2 py-1 text-xs flex items-center gap-1"
                        >
                          {label}
                          <button
                            type="button"
                            onClick={() =>
                              onChange(
                                field.name,
                                value.filter((v) => v !== val)
                              )
                            }
                            className="text-white hover:text-red-400 focus:outline-none"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </fieldset>
            )}

            {field.type === "textarea" && (
              <textarea
                value={value || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                disabled={field.disabled}
                className="w-full border border-slate-300 text-gray-800 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                rows={4}
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={value || ""}
                min={field.min ?? 0}
                max={field.max ?? undefined}
                onChange={(e) => onChange(field.name, e.target.value)}
                disabled={field.disabled}
                className="w-full border border-slate-300 text-gray-800 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            )}

            {field.type === "text" && (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                disabled={field.disabled}
                className="w-full border border-slate-300 text-gray-800 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            )}

            {field.type === "date" && (
              <input
                type="date"
                value={value || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                disabled={field.disabled}
                className="w-full border border-slate-300 text-gray-800 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            )}
          </>
        )}

      {/* Checkbox */}
      {field.type === "checkbox" && (
        <div className="flex items-center space-x-2">
          <label className="text-gray-800 font-medium">{field.label}</label>
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(field.name, e.target.checked)}
            disabled={field.disabled}
            className="w-5 h-5 text-slate-900 focus:ring-2 focus:ring-slate-900"
          />
        </div>
      )}

      {/* Multi Checkbox */}
      {field.type === "multi-checkbox" && (
        <>
          <label className="text-gray-800 block mb-1 font-medium">
            {field.label}
          </label>
          <fieldset disabled={field.disabled}>
            <div className="flex flex-wrap gap-2">
              {field.options?.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={(value || []).includes(opt.value)}
                    onChange={(e) => {
                      let newValue = [...(value || [])];
                      if (e.target.checked) {
                        newValue.push(opt.value);
                      } else {
                        newValue = newValue.filter((v) => v !== opt.value);
                      }
                      onChange(field.name, newValue);
                    }}
                  />
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
          </fieldset>
        </>
      )}

      {/* Repeater */}
      {field.type === "repeater" && (
        <>
          <label className="text-gray-800 block mb-1 font-medium">
            {field.label}
          </label>
          {(value || []).map((item, index) => (
            <div key={index} className="border p-3 mb-3 rounded bg-gray-50">
              {field.fields.map((subField) => (
                <InputComponent
                  key={subField.name + index}
                  field={subField}
                  value={item[subField.name]}
                  onChange={(name, val) => {
                    const updated = (value || []).map((v, idx) =>
                      idx === index ? { ...v, [name]: val } : v
                    );
                    onChange(field.name, updated);
                  }}
                />
              ))}
              {!field.disabled && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = (value || []).filter(
                      (_, idx) => idx !== index
                    );
                    onChange(field.name, updated);
                  }}
                  className="mt-2 text-red-600 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {!field.disabled && (
            <button
              type="button"
              onClick={() => {
                const emptyItem = {};
                field.fields.forEach((f) => (emptyItem[f.name] = ""));
                onChange(field.name, [...(value || []), emptyItem]);
              }}
              className="bg-slate-900 text-white px-4 py-2 rounded text-sm"
            >
              + Add
            </button>
          )}
        </>
      )}
    </div>
  );
}
