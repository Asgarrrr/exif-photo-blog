'use client';

import { RefObject, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { FieldSetType, AnnotatedTag } from '@/photo/form';
import { parameterize } from '@/utility/string';

// shadcn/ui components
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Custom components (keeping existing ones for now)
import Spinner from './Spinner';
import TagInput from './TagInput';
import ResponsiveText from './primitives/ResponsiveText';
import { SelectMenuOptionType } from './SelectMenuOption';
import SelectMenu from './SelectMenu';

export default function FieldsetWithStatusShadcn({
  id: _id,
  label,
  icon,
  note,
  noteShort,
  noteComplex,
  tooltip,
  error,
  value,
  isModified,
  onChange,
  className,
  selectOptions,
  selectOptionsDefaultLabel,
  tagOptions,
  tagOptionsLimit,
  tagOptionsLimitValidationMessage,
  tagOptionsDefaultIcon,
  placeholder,
  loading,
  required,
  readOnly,
  spellCheck,
  capitalize,
  type = 'text',
  inputRef,
  accessory,
  hideLabel,
  tabIndex,
}: {
  id?: string
  label: string
  icon?: ReactNode
  note?: string
  noteShort?: string
  noteComplex?: ReactNode
  tooltip?: string
  error?: string
  value: string
  isModified?: boolean
  onChange?: (value: string) => void
  className?: string
  selectOptions?: SelectMenuOptionType[]
  selectOptionsDefaultLabel?: string
  tagOptions?: AnnotatedTag[]
  tagOptionsLimit?: number
  tagOptionsLimitValidationMessage?: string
  tagOptionsDefaultIcon?: ReactNode
  placeholder?: string
  loading?: boolean
  required?: boolean
  readOnly?: boolean
  spellCheck?: boolean
  capitalize?: boolean
  type?: FieldSetType
  inputRef?: RefObject<HTMLInputElement | null>
  accessory?: ReactNode
  hideLabel?: boolean
  tabIndex?: number
}) {
  const id = _id || parameterize(label);
  const { pending } = useFormStatus();

  const isDisabled = readOnly || pending || loading;
  const hasError = Boolean(error);

  // Helper to render the label content
  const renderLabelContent = () => (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center gap-1.5">
        {icon && (
          <span className="inline-flex items-center justify-center w-4 h-4 shrink-0">
            {icon}
          </span>
        )}
        <span className="truncate">{label}</span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex text-muted-foreground">ⓘ</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {note && !error && (
        <ResponsiveText
          className="text-muted-foreground"
          shortText={`(${noteShort})`}
        >
          ({note})
        </ResponsiveText>
      )}
      
      {noteComplex}
      
      {isModified && !error && (
        <span className="text-primary font-medium text-sm">*</span>
      )}
      
      {error && (
        <span className="text-destructive text-sm">{error}</span>
      )}
      
      {required && (
        <span className="text-muted-foreground text-sm">Required</span>
      )}
      
      {loading && type !== 'checkbox' && (
        <Spinner />
      )}
    </div>
  );

  // Hidden input
  if (type === 'hidden') {
    return (
      <Input
        ref={inputRef}
        type="hidden"
        id={id}
        name={id}
        value={value}
        onChange={e => onChange?.(e.target.value)}
      />
    );
  }

  return (
    <div className={cn(
      'space-y-2',
      type === 'checkbox' && 'flex items-start gap-3 space-y-0',
      className,
    )}>
      {!hideLabel && (
        <Label
          htmlFor={id}
          className={cn(
            type === 'checkbox' && 'order-2 mt-0 cursor-pointer',
            isDisabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {renderLabelContent()}
        </Label>
      )}

      <div className="flex gap-2">
        {/* Select Menu */}
        {selectOptions ? (
          <SelectMenu
            id={id}
            name={id}
            tabIndex={tabIndex}
            className="w-full"
            value={value}
            onChange={onChange}
            options={selectOptions}
            defaultOptionLabel={selectOptionsDefaultLabel}
            error={error}
            readOnly={isDisabled}
          />
        ) : /* Tag Input */
        tagOptions ? (
          <TagInput
            id={id}
            name={id}
            value={value}
            options={tagOptions}
            defaultIcon={tagOptionsDefaultIcon}
            onChange={onChange}
            showMenuOnDelete={tagOptionsLimit === 1}
            className={cn(hasError && 'border-destructive')}
            readOnly={isDisabled}
            placeholder={placeholder}
            limit={tagOptionsLimit}
            limitValidationMessage={tagOptionsLimitValidationMessage}
          />
        ) : /* Textarea */
        type === 'textarea' ? (
          <Textarea
            id={id}
            name={id}
            value={value}
            placeholder={placeholder}
            onChange={e => onChange?.(e.target.value)}
            disabled={isDisabled}
            className={cn(
              'min-h-24 resize-none',
              hasError && 'border-destructive',
            )}
            spellCheck={spellCheck}
            autoCapitalize={!capitalize ? 'off' : undefined}
          />
        ) : /* Checkbox */
        type === 'checkbox' ? (
          <div className="flex items-center gap-2">
            <Checkbox
              id={id}
              name={id}
              checked={value === 'true'}
              onCheckedChange={(checked) => 
                onChange?.(checked ? 'true' : 'false')
              }
              disabled={isDisabled}
              className={cn(hasError && 'border-destructive')}
            />
            {loading && <Spinner />}
          </div>
        ) : /* Regular Input */
        (
          <Input
            ref={inputRef}
            id={id}
            name={id}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={e => onChange?.(e.target.value)}
            disabled={isDisabled}
            className={cn(hasError && 'border-destructive')}
            spellCheck={spellCheck}
            autoComplete="off"
            autoCapitalize={!capitalize ? 'off' : undefined}
            tabIndex={tabIndex}
          />
        )}

        {accessory && (
          <div className="flex items-center">
            {accessory}
          </div>
        )}
      </div>
    </div>
  );
}
