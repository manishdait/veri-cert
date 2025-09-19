import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state"

export const certificateSelector = (state: AppState) => state.certificates;

export const certificate = createSelector(
  certificateSelector,
  (state) => state.certificates
);