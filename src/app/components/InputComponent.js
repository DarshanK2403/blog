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
              <fieldset disabled={field.disabled}>
                <div className="w-full border border-slate-300 bg-white px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(value || []).map((val) => {
                      const label =
                        field.options.find((opt) => opt.value === val)?.label ||
                        val;
                      return (
                        <span
                          key={val}
                          className="bg-slate-900 text-white rounded-full px-3 py-1 text-xs flex items-center"
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
                            className="ml-2 text-red-400 hover:text-red-600"
                          >
                            &times;
                          </button>
                        </span>
                      );
                    })}
                  </div>

                  <select
                    value=""
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (
                        selectedValue &&
                        !(value || []).includes(selectedValue)
                      ) {
                        onChange(field.name, [...(value || []), selectedValue]);
                      }
                    }}
                    className="w-full bg-white text-gray-800"
                  >
                    <option value="">Select</option>
                    {field.options
                      .filter((opt) => !(value || []).includes(opt.value))
                      .map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
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
