import {
  Badge,
  Button,
  Center,
  Table,
  Title,
  createStyles,
} from '@mantine/core';
import { type User } from 'lucia-auth';
import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
} from 'next';
import {} from 'react';
import { auth } from '~/auth/lucia';
import { api } from '~/utils/api';

const useStyles = createStyles((theme) => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
  listItem: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.gray[0],
    borderRadius: theme.radius.md,
  },
}));

const Appointments = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data } = api.appointment.appointments.useQuery();
  const { classes } = useStyles();
  const assign = api.appointment.assign.useMutation();

  return (
    <div>
      <Title order={2} align='center' mt='lg'>
        Appointments
      </Title>
      <Center mt='xl' mx='lg'>
        <Table title='Appointments'>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Appointment Date</th>
              <th>Appointment Time</th>
              <th>Appointment Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {data?.appointments?.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.name}</td>
                <td>{appointment.email}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>
                  {appointment.assignedTo ? (
                    <Badge color='green'>Assigned</Badge>
                  ) : (
                    <Badge color='orange' mx='auto'>
                      Open
                    </Badge>
                  )}
                </td>
                <td>
                  <Button
                    onClick={() => {
                      void assign.mutateAsync({
                        appointmentId: appointment.id,
                      });
                    }}
                    loading={
                      assign.variables?.appointmentId === appointment.id &&
                      assign.isLoading
                    }
                    disabled={
                      assign.variables?.appointmentId === appointment.id &&
                      assign.isLoading
                    }
                  >
                    {appointment.assignedTo ? 'UnAssign' : 'Assign'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Center>
    </div>
  );
};

export default Appointments;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ user: User }>> => {
  const { req, res } = context;
  const authRequest = auth.handleRequest(req, res);
  const { user } = await authRequest.validateUser();
  if (!user)
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  return {
    props: {
      user,
    },
  };
};
