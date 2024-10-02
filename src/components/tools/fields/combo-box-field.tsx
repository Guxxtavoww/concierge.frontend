'use client';

import { Check } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { useState, useRef, type ElementRef } from 'react';

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
import {
  type TranslationFunction,
  useTranslations,
} from '@/contexts/translations.context';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

import type { SelectFieldProps } from './select-field';

type Extends = Record<string, any>;

interface ComboBoxFieldProps<T extends Extends> extends SelectFieldProps<T> {}

interface VirtualListProps<T extends Extends>
  extends Pick<
    ComboBoxFieldProps<T>,
    'options' | 'labelAccessor' | 'valueAccessor'
  > {
  currentValue?: string | number;
  onSelectOption: (optionValue?: string | number) => void;
  translation: TranslationFunction;
}

function VirtualList<T extends Extends>({
  labelAccessor,
  onSelectOption,
  options = [],
  valueAccessor,
  currentValue,
  translation,
}: VirtualListProps<T>) {
  const [filteredOptions, setFilteredOptions] =
    useState<ComboBoxFieldProps<T>['options']>(options);

  const optionsContainerRef = useRef<ElementRef<'div'>>(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => optionsContainerRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  return (
    <Command
      shouldFilter={false}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
        }
      }}
    >
      <CommandInput
        onValueChange={(search) => {
          setFilteredOptions(
            options.filter((option) =>
              String(option[labelAccessor])
                .toLowerCase()
                .includes(search.toLowerCase() ?? [])
            )
          );
        }}
        placeholder={translation(
          'form_fields_default_texts.filter_text_input_placeholder'
        )}
      />
      {filteredOptions.length > 0 ? ( // Check if options have elements before rendering
        <>
          <CommandGroup
            ref={optionsContainerRef}
            style={{
              height: '400px',
              width: '100%',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualOptions?.map((virtualOption) => {
                const option = filteredOptions[virtualOption.index];

                if (!option) return null;

                const label = option[labelAccessor];
                const value = option[valueAccessor];

                return (
                  <CommandItem
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualOption.size}px`,
                      transform: `translateY(${virtualOption.start}px)`,
                    }}
                    key={value}
                    value={value}
                    onSelect={onSelectOption}
                  >
                    {currentValue === value ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : null}
                    {label}
                  </CommandItem>
                );
              })}
            </div>
          </CommandGroup>
        </>
      ) : (
        <CommandEmpty>
          {translation('common_texts.empty_list_message')}
        </CommandEmpty>
      )}
    </Command>
  );
}

export function ComboBoxField<T extends Extends>({
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

  const [isPopoverOpen, setIsPopoverOpen] = useState(autoFocus);

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
              className="min-w-full relative max-h-[400px]"
              align="start"
              side="bottom"
            >
              <VirtualList
                labelAccessor={labelAccessor}
                options={options}
                translation={translation}
                valueAccessor={valueAccessor}
                currentValue={field.value}
                onSelectOption={(value) => {
                  field.onChange(value);
                  setIsPopoverOpen(false);
                }}
              />
            </PopoverContent>
            <FormMessage />
          </FormItem>
        </Popover>
      )}
    />
  );
}
