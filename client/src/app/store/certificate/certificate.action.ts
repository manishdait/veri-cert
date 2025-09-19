import { createAction, props } from "@ngrx/store";
import { Certificate } from "../../model/certificate.model";

export const setCertificates = createAction('[Certificate] Set Certificates', props<{certificates: Certificate[]}>());
export const addCertificates = createAction('[Certificate] Add Certificate', props<{certificate: Certificate}>());
export const updateCertificate = createAction('[Certificate] Update Certificate', props<{certificate: Certificate}>());
