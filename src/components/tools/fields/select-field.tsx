import { useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useVirtualizer } from '@tanstack/react-virtual';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectContentRef,
} from '@/components/ui/select';

export interface SelectFieldProps<
  TData extends Record<string, any>,
  Keys extends keyof TData = keyof TData
> {
  name: string;
  defaultValue?: TData[Keys];
  options: TData[];
  disabled?: boolean;
  labelAccessor: Keys;
  valueAccessor: Keys;
  selectLabel?: string;
  placeholder?: string;
  className?: string;
}

export function SelectField<T extends Record<string, any>>({
  labelAccessor,
  name,
  options,
  valueAccessor,
  defaultValue,
  disabled,
  selectLabel,
  placeholder,
  className,
}: SelectFieldProps<T>) {
  const { control } = useFormContext();
  const optionsContainerRef = useRef<SelectContentRef>(null);

  const count = useMemo(() => options.length, [options]);

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => optionsContainerRef.current,
    estimateSize: () => 12,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className={className}>
          {selectLabel ? <FormLabel>{selectLabel}</FormLabel> : null}
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
            disabled={field.disabled}
            name={field.name}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || 'Selecione'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent ref={optionsContainerRef}>
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  position: 'relative',
                  width: '100%',
                }}
              >
                {virtualItems.map((virtualItem) => {
                  const option = options[virtualItem.index];

                  if (!option) return null;

                  return (
                    <SelectItem
                      value={String(option[valueAccessor])}
                      key={virtualItem.index}
                      className="cursor-pointer"
                      style={{
                        position: 'absolute',
                        top: virtualItem.start, // Position each item according to the virtualizer
                        left: 0,
                        right: 0,
                        height: `${virtualItem.size}px`,
                      }}
                    >
                      {String(option[labelAccessor])}
                    </SelectItem>
                  );
                })}
              </div>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
