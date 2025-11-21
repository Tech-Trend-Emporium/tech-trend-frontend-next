import { CheckboxField } from "../atoms/CheckBoxField";
import type { CheckboxFieldProps } from "../atoms/CheckBoxField";



interface ChecklistProps {
  items: CheckboxFieldProps[];
}

export const Checklist = ({ items }: ChecklistProps) => {
  return (
    <div className="flex flex-col gap-2">
      {items.map(({ id, label, name, checked, onChange }) => (
        <CheckboxField
          key={id}
          id={id}
          label={label}
          name={name}
          checked={checked}
          // If the parent provided an onChange, propagate it.
          onChange={onChange}
        />
      ))}
    </div>
  );
};
