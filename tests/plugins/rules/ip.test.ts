import {describe, it, expect} from 'vitest'
import ip from '../../../src/plugins/rules/ip'

describe('ip rule', () => {
    it('resolves with valid IPv4 "192.168.1.1"', async () => {
        await expect(ip('192.168.1.1')).resolves.toBe('192.168.1.1')
    })

    it('resolves with valid IPv4 "0.0.0.0"', async () => {
        await expect(ip('0.0.0.0')).resolves.toBe('0.0.0.0')
    })

    it('resolves with valid IPv4 "255.255.255.255"', async () => {
        await expect(ip('255.255.255.255')).resolves.toBe('255.255.255.255')
    })

    it('resolves with valid IPv6 "::1"', async () => {
        await expect(ip('::1')).resolves.toBe('::1')
    })

    it('resolves with valid IPv6 "2001:db8::1"', async () => {
        await expect(ip('2001:db8::1')).resolves.toBe('2001:db8::1')
    })

    it('resolves with valid IPv6 "fe80::1"', async () => {
        await expect(ip('fe80::1')).resolves.toBe('fe80::1')
    })

    it('rejects with invalid IPv4 "256.1.1.1"', async () => {
        await expect(ip('256.1.1.1')).rejects.toBeUndefined()
    })

    it('rejects with "not-an-ip"', async () => {
        await expect(ip('not-an-ip')).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(ip(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(ip(undefined)).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(ip('')).rejects.toBeUndefined()
    })
})
