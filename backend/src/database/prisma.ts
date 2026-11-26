import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';

// Cria a instancia do prismaclient e export ela, podendo ser utilzada nos outros arquivos
export const prisma = new PrismaClient();