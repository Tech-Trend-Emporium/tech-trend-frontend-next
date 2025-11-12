/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

let _authCache: any = null;
export const getAuth = () => _authCache;
export const setAuthCache = (v: any) => { _authCache = v; };

export const storageKey = "auth";

export const readFromStorage = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "null"); }
    catch { return null; }
};

export const writeToStorage = (value: any) => {
    try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch {}
};

export const clearStorage = () => {
    try { localStorage.removeItem(storageKey); } catch {}
};

export const clearAuth = () => {
    _authCache = null;
    clearStorage();
};

export const setAuth = (value: any) => {
    _authCache = value;
    writeToStorage(value);
};