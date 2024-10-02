'use client';

import { SearchIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useState, useMemo, useRef, type ElementRef } from 'react';

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { useTranslations } from '@/contexts/translations.context';

import type { SelectFieldProps } from './select-field';

interface ComboBoxFieldProps<T extends Record<string, any>>
  extends SelectFieldProps<T> {}

export function ComboBoxField<T extends Record<string, any>>({
  labelAccessor,
  name,
  options,
  valueAccessor,
  autoFocus = false,
  className,
  defaultValue,
  disabled,
  placeholder,
  selectLabel,
}: ComboBoxFieldProps<T>) {
  const { control } = useFormContext();
  const { translation } = useTranslations();
  const [filterText, setFilterText] = useState<string>('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(autoFocus);

  const optionsContainerRef = useRef<ElementRef<'div'>>(null);

  const filteredOptions = useMemo(() => {
    if (!filterText) return options;

    return options.filter((option) =>
      String(option[labelAccessor])
        .toLowerCase()
        .includes(filterText.toLowerCase())
    );
  }, [filterText, options, labelAccessor]);

  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      render={({ field }) => (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <FormItem className={className}>
            {selectLabel ? <FormLabel>{selectLabel}</FormLabel> : null}
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPopoverOpen}
                className="max-w-[300px] w-full justify-between"
                autoFocus={autoFocus}
                disabled={field.disabled}
                type="button"
              >
                {field.value
                  ? (
                      options.find(
                        (option) => option[valueAccessor] === field.value
                      ) as T
                    )[labelAccessor]
                  : placeholder ||
                    translation(
                      'form_fields_default_texts.select_field_placeholder'
                    )}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              ref={optionsContainerRef}
              className="min-w-full relative space-y-2 overscroll-contain max-h-[300px] overflow-hidden"
              align="start"
              side="bottom"
            >
              <InputWithIcon
                value={filterText}
                placeholder={translation(
                  'form_fields_default_texts.filter_text_input_placeholder'
                )}
                onChange={(e) => setFilterText(e.target.value)}
                className="sticky top-0 left-0"
                icon={SearchIcon}
              />
              <ScrollArea className="space-y-2 flex flex-col h-[260px]">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const value = option[valueAccessor];
                    const isSelected = value === field.value;

                    return (
                      <Button
                        key={index}
                        onClick={() => {
                          field.onChange(isSelected ? undefined : value);

                          setIsPopoverOpen(false);
                          setFilterText('');
                        }}
                        variant={isSelected ? 'secondary' : 'ghost'}
                        className="w-full flex items-center justify-between"
                        type="button"
                      >
                        {String(option[labelAccessor])}
                        {isSelected ? (
                          <CheckIcon className="ml-auto h-4 w-4" />
                        ) : null}
                      </Button>
                    );
                  })
                ) : (
                  <p>{translation('common_texts.empty_list_message')}</p>
                )}
              </ScrollArea>
            </PopoverContent>
            <FormMessage />
          </FormItem>
        </Popover>
      )}
    />
  );
}
