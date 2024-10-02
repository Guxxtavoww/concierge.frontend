import { forwardRef } from 'react';

import { cn } from '@/utils/cn.util';

import { Input, type InputProps } from './input';
import { LucideIcon, type Icon } from '../tools/lucide-icon';

interface InputWithIconProps extends InputProps {
  icon: Icon;
}

const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, icon, ...props }, ref) => (
    <div className={cn("relative", className)}>
      <LucideIcon icon={icon} size="sm" className="absolute left-2 mr-2 top-1/2 -translate-y-1/2" />
      <Input className="pl-7" ref={ref} {...props} />
    </div>
  )
);
InputWithIcon.displayName = 'InputWithIcon';

export { InputWithIcon };
