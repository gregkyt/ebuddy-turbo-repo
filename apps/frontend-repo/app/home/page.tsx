"use client";

import Container from "@/components/Container";
import {
  fetchUserAsync,
  fetchUsersAsync,
  setUpdateUserStatus,
  setUsersStatus,
  setUserStatus,
  updateUserAsync,
} from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { UpdateUserPayload } from "@repo/entities/user";

const Detail = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const userStatus = useAppSelector((state) => state.user.userStatus);
  const updateUserStatus = useAppSelector(
    (state) => state.user.updateUserStatus
  );

  const [formErrors, setFormErrors] = useState<Record<string, any>>({
    name: "",
    gender: "",
    totalAverageWeightRatings: "",
    numberOfRents: "",
  });
  const [data, setData] = useState<Record<string, any>>({});

  const searchParams = useSearchParams();
  const uid = searchParams?.get("uid");

  useEffect(() => {
    if (uid) dispatch(fetchUserAsync(uid));
  }, [uid]);

  useEffect(() => {
    const content = {
      name: user?.name,
      gender: user?.gender ?? "",
      id: user?.id ?? "",
      uid: user?.uid ?? "",
      totalAverageWeightRatings: user?.totalAverageWeightRatings,
      numberOfRents: user?.numberOfRents,
      recentlyActive:
        dayjs(user?.recentlyActive).format("YYYY MMMM DD HH:mm:ss") ??
        dayjs().format("YYYY MMMM DD HH:mm:ss"),
    };

    setData(content);
  }, [user]);

  function onChangeText(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
  }

  function validate() {
    const tempErrors = {
      name: "",
      gender: "",
      totalAverageWeightRatings: "",
      numberOfRents: "",
    };
    let isValid = true;

    if (!data.name) {
      tempErrors.name = "name is required";
      isValid = false;
    }

    if (!data.gender || !["male", "female"].includes(data.gender)) {
      tempErrors.gender = "gender is required";
      isValid = false;
    }

    if (!data.totalAverageWeightRatings) {
      tempErrors.gender = "totalAverageWeightRatings is required";
      isValid = false;
    }

    if (!data.numberOfRents) {
      tempErrors.gender = "numberOfRents is required";
      isValid = false;
    }

    setFormErrors(tempErrors);
    return isValid;
  }

  async function onUpdate(e: FormEvent) {
    e.preventDefault();
    if (validate()) {
      const payload: UpdateUserPayload = {
        uid: data.uid,
        name: data.name,
        gender: data.gender,
        numberOfRents: Number(data.numberOfRents),
        totalAverageWeightRatings: Number(data.totalAverageWeightRatings),
      };
      dispatch(updateUserAsync(payload));
      setTimeout(() => {
        dispatch(fetchUsersAsync());
      }, 1000);
    }
  }

  return (
    <Container>
      {userStatus === "loading" ? (
        <Skeleton animation="wave" />
      ) : (
        <div className="h-screen p-4">
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, marginBottom: "16px" }}
          >
            Detail User
          </Typography>
          <form onSubmit={(e) => onUpdate(e)}>
            {Object.keys(data).map((item, index) => {
              return (
                <Stack
                  key={index}
                  spacing={2}
                  direction={"row"}
                  sx={{
                    marginTop: `${index === 0 ? "0px" : "8px"}`,
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ width: "200px" }}>{item}</Typography>
                  <Typography>:</Typography>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <TextField
                      name={item}
                      type="text"
                      disabled={["id", "uid", "recentlyActive"].includes(item)}
                      value={data[item] ?? ""}
                      onChange={onChangeText}
                    />
                    <FormHelperText error>{formErrors[item]}</FormHelperText>
                  </FormControl>
                </Stack>
              );
            })}
            <Button
              sx={{ marginTop: "16px" }}
              loading={updateUserStatus === "loading"}
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </div>
      )}
    </Container>
  );
};

const Table = () => {
  const [rows, setRows] = useState<Record<string, any>[]>([]);

  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.user.users);

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, []);

  useEffect(() => {
    if (users) {
      const datas: Record<string, any>[] = [];
      users.map((item) => {
        const data = { ...item };
        datas.push(data);
      });
      setRows(datas);
    }
  }, [users]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Name", width: 70 },
    {
      field: "gender",
      headerName: "Gender",
      width: 90,
    },
    {
      field: "totalAverageWeightRatings",
      headerName: "Weight Ratings",
      width: 140,
      type: "number",
    },
    {
      field: "numberOfRents",
      headerName: "Rents",
      width: 90,
      type: "number",
    },
    {
      field: "recentlyActive",
      headerName: "Recently Active",
      width: 160,
    },
    {
      field: "finalScore",
      headerName: "Final Score",
      width: 180,
    },
  ];
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default function Home() {
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector((state) => state.user.userStatus);
  const usersStatus = useAppSelector((state) => state.user.usersStatus);
  const updateUserStatus = useAppSelector(
    (state) => state.user.updateUserStatus
  );

  return (
    <Suspense fallback={<Skeleton animation="wave" />}>
      <Detail />
      <Table />
      <Snackbar
        open={[userStatus, usersStatus, updateUserStatus].includes("failed")}
        autoHideDuration={3000}
        onClose={() => {
          dispatch(setUserStatus("idle"));
          dispatch(setUsersStatus("idle"));
          dispatch(setUpdateUserStatus("idle"));
        }}
      >
        <Alert severity="error" variant="filled">
          Failed
        </Alert>
      </Snackbar>
    </Suspense>
  );
}
