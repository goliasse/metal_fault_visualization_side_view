export interface Fault {
  id: number;
  category: 1 | 2 | 3;
  shape: 'rectangle' | 'circle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
}