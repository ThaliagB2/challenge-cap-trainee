import { describe, expect, it } from 'vitest';

import { makeValidPayload, makeSut, makePayloadWithSingleProcedure } from './shared-helpers';

describe('ScheduleEmergencyAppointmentUseCase - Success Cases', () => {
    it('should return appointment id when emergency appointment is created successfully', async () => {
        const { sut } = makeSut();
        const result = await sut.execute(makeValidPayload());

        expect(result.isRight()).toBeTruthy();
        expect(typeof result.value).toBe('string');
        expect(result.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should create emergency appointment with single procedure', async () => {
        const { sut } = makeSut();
        const result = await sut.execute(makePayloadWithSingleProcedure());

        expect(result.isRight()).toBeTruthy();
        expect(typeof result.value).toBe('string');
    });

    it('should calculate total cost with 50% emergency surcharge', async () => {
        const { sut, appointmentRepository } = makeSut();
        const payload = makeValidPayload();

        await sut.execute(payload);

        const createdAppointment = appointmentRepository.createdAppointments[0];
        expect(createdAppointment.totalCost).toBe(255); 
    });

    it('should set isEmergency to true', async () => {
        const { sut, appointmentRepository } = makeSut();

        await sut.execute(makeValidPayload());

        const createdAppointment = appointmentRepository.createdAppointments[0];
        expect(createdAppointment.isEmergency).toBe(true);
    });

    it('should set status to IN_PROGRESS', async () => {
        const { sut, appointmentRepository } = makeSut();

        await sut.execute(makeValidPayload());

        const createdAppointment = appointmentRepository.createdAppointments[0];
        expect(createdAppointment.status).toBe('IN_PROGRESS');
    });

    it('should generate UUIDs for procedures', async () => {
        const { sut, appointmentRepository } = makeSut();

        await sut.execute(makeValidPayload());

        const createdAppointment = appointmentRepository.createdAppointments[0];
        createdAppointment.procedures.forEach((procedure) => {
            expect(procedure.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        });
    });
});

