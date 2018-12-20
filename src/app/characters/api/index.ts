import { config }    from '@/environment';
import { crud }      from '@/tools';
import { Character } from '../models';


export interface Create {
    name: string;
}

export interface Update {
    name: string;
}

export const api: crud.Api<Character, Create, Update> = {
    ...crud.api<Character, Create, Update>(`${config.apiPrefix}/characters`),
};
