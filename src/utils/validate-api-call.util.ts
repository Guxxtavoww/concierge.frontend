import type { ZodSchema, ZodTypeDef } from 'zod';
import type { AxiosRequestConfig, Method } from 'axios';

import { api } from '@/lib/api/api.lib';

interface iValidatedAPICallProps<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput
> extends Omit<
    AxiosRequestConfig<TOutput>,
    'method' | 'url' | 'data' | 'params'
  > {
  body?: any;
  method?: Method;
  endpoint: string;
  hideErrorMessage?: boolean;
  customToastErrorMessage?: string;
  zodSchema: ZodSchema<TOutput, TDef, TInput>;
  params?: Record<string, Maybe<string | number | Date>>;
}

export async function validateApiCall<T>({
  body,
  endpoint,
  params,
  method = 'GET',
  customToastErrorMessage,
  zodSchema,
  hideErrorMessage,
  ...rest
}: iValidatedAPICallProps<T>): Promise<T> {
  try {
    const response = await api.request({
      method,
      url: endpoint,
      data: body,
      params,
      ...rest,
    });

    const responseParsedData = await zodSchema.parseAsync(response.data);

    return Promise.resolve(responseParsedData);
  } catch (error) {
    return Promise.reject(error);
  }
}
