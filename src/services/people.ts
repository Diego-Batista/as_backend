import { Prisma, PrismaClient } from "@prisma/client";
import * as groups from "./groups";

const prisma = new PrismaClient();

type FiltersPeople = {
    id_event: number
    id_group?: number
}

export const getAll = async ( filters: FiltersPeople) => {
    try {
        return await prisma.eventPeople.findMany({ where: filters });
    } catch(err) {
        return false
    }
}

type FiltersGetPerson = {
    id_event: number
    id_group?: number
    id?: number
    cpf?: string
}

export const getPerson = async ( filters: FiltersGetPerson) => {
    try {
        if(!filters.id && !filters.cpf) return false;
        return await prisma.eventPeople.findFirst({ where: filters });
    } catch(err) {
        return false
    }
}

type PersonCreateData = Prisma.Args<typeof prisma.eventPeople, 'create'>['data']

export const addPerson = async ( data: PersonCreateData) => {
    try {
        if(!data.id_group) return false;

        const group = await groups.getOne({
            id: data.id_group,
            id_event: data.id_event
        })

        if(!group) return false;

        return await prisma.eventPeople.create({ data });
    } catch(err) {
        return false
    }
}

type FiltersUpdatePerson = {
    id_event: number
    id_group?: number
    id?: number
}

type PersonUpdateData = Prisma.Args<typeof prisma.eventPeople, 'update'>['data']

export const updatePerson = async ( filters: FiltersUpdatePerson, data: PersonUpdateData) => {
    try { 
        return await prisma.eventPeople.updateMany({ where: filters, data });
    } catch(err) {
        return false
    }
}

type FiltersdeletePerson = {
    id_event?: number
    id_group?: number
    id: number
}

export const removePerson = async ( filters: FiltersdeletePerson ) => {
    try { 
        return await prisma.eventPeople.delete({ where: filters });
    } catch(err) {
        return false
    }
}