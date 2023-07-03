import { SEX } from '@/enums/user';
// 性别
export function formatSex<T extends keyof typeof SEX>(value: T) {
  return SEX[value] || '未知';
}
