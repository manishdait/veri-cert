import { createReducer, on, State } from "@ngrx/store";
import { Certificate } from "../../model/certificate.model";
import { addCertificates, setCertificates, updateCertificate } from "./certificate.action";

export interface CertificateState {
  certificates: Certificate[];
};

export const initialState: CertificateState = {
  certificates: []
};

export const certificateReducer = createReducer(
  initialState,
  on(setCertificates, (state, {certificates}) => ({
    ...state,
    certificates: certificates
  })),
  on(addCertificates, (state, {certificate}) => ({
    ...state,
    certificates: [certificate, ...state.certificates]
  })),
  on(updateCertificate, (state, {certificate}) => ({
    ...state,
    certificates: state.certificates.map(c => c.uuid !== certificate.uuid? c : certificate)
  }))
)
