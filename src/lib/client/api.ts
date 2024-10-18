/* eslint-disable @typescript-eslint/no-explicit-any */
import { error } from '@sveltejs/kit';

// const base = 'http://localhost:5173/api';
const base = '/api';
type HttpMethod = "POST"|"GET"|"PUT"|"PATCH"|"DELETE"

type ApiSendParam = {
    method: HttpMethod,
    path: string,
    data: any,
}

export const getTokenFromLocalStorage = () => {
    try {
        return window.localStorage.getItem('token')
    } catch (err) {
        console.log(err)
        return null
    }
}

export const clearTokenFromLocalStorage = () => {
    try {
        return window.localStorage.removeItem('token')
    } catch (err) {
        console.log(err)
        return null
    }
}

async function send( { method, path, data }: ApiSendParam ){
    const token = getTokenFromLocalStorage()
    if(!token) return error(511)

	const opts: RequestInit = { 
        method, 
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        } 
    };

	if (data) {
        if(typeof data == "string"){
            opts.body = data
        }
        else{
            opts.body = JSON.stringify(data);
        }
    }
    

	const res = await fetch(`${base}/${path}`, opts);
	if (res.ok || res.status === 422) {
		const text = await res.text();
		return text ? JSON.parse(text) : {};
	}

	error(res.status);
}

export function get(path: string) {
	return send({ method: 'GET', path, data: undefined });
}

export function del(path: string, data: any = {}) {
	return send({ method: 'DELETE', path, data });
}

export function post(path: string, data: any = {}) {
	return send({ method: 'POST', path, data });
}

export function put(path: string, data: any = {}) {
	return send({ method: 'PUT', path, data });
}

export function patch(path: string, data: any = {}) {
	return send({ method: 'PATCH', path, data });
}