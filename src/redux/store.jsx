import { configureStore } from "@reduxjs/toolkit";
import departmentReducer from "./slices/departmentSlice";
import staffReducer from "./slices/staffSlice";

const store = configureStore({
    reducer: {
        department: departmentReducer,
        staff: staffReducer,
    },
});
export default store;