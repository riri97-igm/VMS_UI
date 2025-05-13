import departmentService from "../../services/departmentService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDepartments = createAsyncThunk(
    "department/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await departmentService.getAllDepartments();
        }
        
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createDepartment = createAsyncThunk(
    "department/create",
    async (department, { rejectWithValue }) => {
        try {
            return await departmentService.createDepartment(department);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateDepartment = createAsyncThunk(
    "department/update",
    async({ id, department }, { rejectWithValue }) => {
        try {
            return await departmentService.updateDepartment(id, department);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteDepartment = createAsyncThunk(
    "department/delete",
    async (id, { rejectWithValue }) => {
        try {
            const sucess = await departmentService.deleteDepartment(id);
            if (sucess) {
                return id;
            }
            throw new Error("File to delete department");
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const departmentSlice = createSlice({
    name: "department",
    initialState: {
        departments: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handling create department
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handling create department
            .addCase(createDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments.push(action.payload); // Add newly created department to state
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handling delete department
            .addCase(deleteDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = state.departments.filter(
                    (department) => department.id !== action.payload
                ); // Remove department from state based on ID
            })
            .addCase(deleteDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handling update department
            .addCase(updateDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.departments.findIndex(
                    (department) => department.id === action.payload.id
                );
                if (index >= 0) {
                    state.departments[index] = action.payload; // Update department in state
                }
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default departmentSlice.reducer;