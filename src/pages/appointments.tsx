import { Badge, Button, Center, Table, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import { type Status } from '@prisma/client';

const statuses: Record<Status, React.ReactNode> = {
  Open: (
    <Badge color='orange' mx='auto'>
      Open
    </Badge>
  ),
  Assigned: <Badge color='green'>Assigned</Badge>,
  Closed: <Badge>Closed</Badge>,
  ReOpened: <Badge color='grape'>ReOpened</Badge>,
};

const Appointments = () => {
  const { data } = api.appointment.appointments.useQuery();
  const assign = api.appointment.assign.useMutation();
  const close = api.appointment.close.useMutation();
  const reopen = api.appointment.reopen.useMutation();
  const { user } = useSession().data ?? {};

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
              <th></th>
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
                <td>{statuses[appointment.status]}</td>
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
                      Boolean(appointment.assignedTo) ||
                      appointment.status === 'Closed'
                    }
                  >
                    Assign
                  </Button>
                </td>
                <td>
                  <Button
                    onClick={() => {
                      void reopen.mutateAsync({
                        appointmentId: appointment.id,
                      });
                    }}
                    loading={
                      reopen.variables?.appointmentId === appointment.id &&
                      reopen.isLoading
                    }
                    disabled={
                      appointment.assignedTo !== user?.id ||
                      appointment.status === 'Closed' ||
                      appointment.status === 'ReOpened' ||
                      appointment.status === 'Open'
                    }
                    color='orange'
                  >
                    Reopen
                  </Button>
                </td>
                <td>
                  <Button
                    onClick={() => {
                      void close.mutateAsync({
                        appointmentId: appointment.id,
                      });
                    }}
                    loading={
                      close.variables?.appointmentId === appointment.id &&
                      close.isLoading
                    }
                    disabled={
                      appointment.assignedTo !== user?.id ||
                      appointment.status === 'Closed'
                    }
                    color='green'
                  >
                    Close
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
