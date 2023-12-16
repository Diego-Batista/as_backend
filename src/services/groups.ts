import { Prisma, PrismaClient } from "@prisma/client";
import * as events from "./events";

const prisma = new PrismaClient();

export const getAll = async ( id_event: number ) => {
    try {
        return await prisma.eventGroup.findMany({ where: { id_event }});
    } catch(err) {
        return false
    }
}

type getOneFilters = {
    id_event?: number 
    id: number 
}

export const getOne = async (filters: getOneFilters) => {
    try {
        return await prisma.eventGroup.findFirst({ where: filters });
    } catch(err) {
        return false
    }
}

type GroupCreateData = Prisma.Args<typeof prisma.eventGroup, 'create'>['data']

export const addGroup = async (data: GroupCreateData) => {
    try {
        if(!data.id_event) return false;

        const eventItem = await events.getOne(data.id_event);

        if(!eventItem) return false;
        
        return await prisma.eventGroup.create({ data });
    } catch(err) {
        return false
    }
}

type UpdateFilters = {
    id: number
    id_event?: number
}

type GroupUpdateData = Prisma.Args<typeof prisma.eventGroup, 'update'>['data']

export const updateGroup = async (filters: UpdateFilters, data: GroupUpdateData) => {
    try { 
        return await prisma.eventGroup.update({ where: filters, data });
    } catch(err) {
        return false
    }
}

type deleteFilters = {
    id: number
    id_event?: number
}

export const deleteGroup = async (filters: deleteFilters) => {
    try {
        return await prisma.eventGroup.delete({ where: filters });
    } catch(err) {
        return false
    }
}