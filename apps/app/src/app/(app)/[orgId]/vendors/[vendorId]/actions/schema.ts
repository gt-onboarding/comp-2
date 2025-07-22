import { TaskStatus, VendorCategory, VendorStatus } from '@comp/db/types';
import { getTranslations } from 'gt-next/server';
import { z } from 'zod';

export const createVendorTaskCommentSchema = z.object({
  vendorId: z.string().min(1, {
    message: 'Vendor ID is required',
  }),
  vendorTaskId: z.string().min(1, {
    message: 'Task ID is required',
  }),
  content: z.string().min(1, {
    message: 'Task content is required',
  }),
});

export const createVendorTaskCommentSchemaI18n = async () => {
  const t = await getTranslations();
  return z.object({
    vendorId: z.string().min(1, {
      message: t('Vendor ID is required'),
    }),
    vendorTaskId: z.string().min(1, {
      message: t('Task ID is required'),
    }),
    content: z.string().min(1, {
      message: t('Task content is required'),
    }),
  });
};

export const createVendorTaskSchema = z.object({
  vendorId: z.string().min(1, {
    message: 'Vendor ID is required',
  }),
  title: z.string().min(1, {
    message: 'Title is required',
  }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  assigneeId: z.string().nullable(),
});

export const createVendorTaskSchemaI18n = async () => {
  const t = await getTranslations();
  return z.object({
    vendorId: z.string().min(1, {
      message: t('Vendor ID is required'),
    }),
    title: z.string().min(1, {
      message: t('Title is required'),
    }),
    description: z.string().min(1, {
      message: t('Description is required'),
    }),
    dueDate: z.date({
      required_error: t('Due date is required'),
    }),
    assigneeId: z.string().nullable(),
  });
};

export const vendorContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
});

export const vendorContactSchemaI18n = async () => {
  const t = await getTranslations();
  return z.object({
    name: z.string().min(1, t('Name is required')),
    email: z.string().email(t('Invalid email address')),
    role: z.string().min(1, t('Role is required')),
  });
};

export const createVendorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  website: z.string().url('Must be a valid URL'),
  description: z.string().min(1, 'Description is required'),
  category: z.nativeEnum(VendorCategory),
  assigneeId: z.string().nullable(),
  contacts: z.array(vendorContactSchema).min(1, 'At least one contact is required'),
});

export const createVendorSchemaI18n = async () => {
  const t = await getTranslations();
  const contactSchema = await vendorContactSchemaI18n();
  return z.object({
    name: z.string().min(1, t('Name is required')),
    website: z.string().url(t('Must be a valid URL')),
    description: z.string().min(1, t('Description is required')),
    category: z.nativeEnum(VendorCategory),
    assigneeId: z.string().nullable(),
    contacts: z.array(contactSchema).min(1, t('At least one contact is required')),
  });
};

export const updateVendorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.nativeEnum(VendorCategory),
  status: z.nativeEnum(VendorStatus),
  assigneeId: z.string().nullable(),
});

export const updateVendorSchemaI18n = async () => {
  const t = await getTranslations();
  return z.object({
    id: z.string(),
    name: z.string().min(1, t('Name is required')),
    description: z.string().min(1, t('Description is required')),
    category: z.nativeEnum(VendorCategory),
    status: z.nativeEnum(VendorStatus),
    assigneeId: z.string().nullable(),
  });
};

export const createVendorCommentSchema = z.object({
  vendorId: z.string(),
  content: z.string().min(1),
});

export const updateVendorRiskSchema = z.object({
  id: z.string(),
  inherent_risk: z.enum(['low', 'medium', 'high', 'unknown']).optional(),
  residual_risk: z.enum(['low', 'medium', 'high', 'unknown']).optional(),
});

export const updateVendorTaskSchema = z.object({
  id: z.string().min(1, {
    message: 'Task ID is required',
  }),
  vendorId: z.string().min(1, {
    message: 'Vendor ID is required',
  }),
  title: z.string().min(1, {
    message: 'Title is required',
  }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
  dueDate: z.date().optional(),
  status: z.nativeEnum(TaskStatus, {
    required_error: 'Task status is required',
  }),
  assigneeId: z.string().nullable(),
});

export const updateVendorTaskSchemaI18n = async () => {
  const t = await getTranslations();
  return z.object({
    id: z.string().min(1, {
      message: t('Task ID is required'),
    }),
    vendorId: z.string().min(1, {
      message: t('Vendor ID is required'),
    }),
    title: z.string().min(1, {
      message: t('Title is required'),
    }),
    description: z.string().min(1, {
      message: t('Description is required'),
    }),
    dueDate: z.date().optional(),
    status: z.nativeEnum(TaskStatus, {
      required_error: t('Task status is required'),
    }),
    assigneeId: z.string().nullable(),
  });
};
