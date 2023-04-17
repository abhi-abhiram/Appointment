import { type NextPage } from 'next';
import Head from 'next/head';
import {
  Button,
  Center,
  Group,
  ScrollArea,
  Text,
  TextInput,
  Title,
  createStyles,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { rem } from '@mantine/core';
import dayjs from 'dayjs';
import { z } from 'zod';
import { useRef } from 'react';
import { Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { api } from '~/utils/api';

const useStyles = createStyles((theme) => ({
  timeslot: {
    padding: rem(10),
    backgroundColor: theme.colors.blue[0],
    color: theme.colors.blue[9],
    borderRadius: rem(5),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.blue[1],
    },
  },

  timeslotActive: {
    backgroundColor: theme.colors.blue[5],
    color: theme.white,
    '&:hover': {
      backgroundColor: theme.colors.blue[5],
    },
  },

  timeslotDisabled: {
    backgroundColor: theme.colors.gray[0],
    color: theme.colors.gray[5],
    cursor: 'not-allowed',
  },

  timeslotWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: rem(10),
  },
}));

export const TimeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '3:00 PM',
] as const;

const TimeSlot = ({
  disabled,
  text,
  selected,
  onClick,
}: {
  disabled?: boolean;
  text: string;
  selected?: boolean;
  onClick?: () => void;
}) => {
  const { classes, cx } = useStyles();

  return (
    <div
      className={cx(classes.timeslot, {
        [classes.timeslotActive]: selected,
        [classes.timeslotDisabled]: disabled,
      })}
      onClick={onClick}
    >
      <Text size={'sm'}>{text}</Text>
    </div>
  );
};

const validationSchema = z.object({
  email: z.string().email('Email is not valid'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  date: z.string(),
  time: z.enum(TimeSlots),
});

const Home: NextPage = () => {
  const { classes } = useStyles();
  const { mutateAsync } = api.appointment.create.useMutation();
  const resetRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <Head>
        <title>Create T3 App</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Center mt='lg'>
        <div
          style={{
            marginBottom: rem(100),
          }}
        >
          <Title
            order={1}
            mb='sm'
            style={{
              textAlign: 'center',
            }}
          >
            Make an Appointment
          </Title>
          <Formik
            initialValues={{
              email: '',
              name: '',
              date: '',
              time: '' as typeof TimeSlots[number],
            }}
            onSubmit={(vals) => {
              void mutateAsync(vals);
            }}
            validationSchema={toFormikValidationSchema(validationSchema)}
          >
            {({
              handleBlur,
              handleChange,
              handleSubmit,
              values,
              setFieldValue,
              errors,
              resetForm,
            }) => (
              <form id='appointmentForm' onSubmit={handleSubmit}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    gap: rem(50),
                  }}
                >
                  <div>
                    <Text size={'sm'} mb={'sm'}>
                      Select Date
                    </Text>
                    <DatePicker
                      onChange={(date) => {
                        setFieldValue('date', dayjs(date).format('YYYY-MM-DD'));
                        console.log(values.date);
                      }}
                      value={dayjs(values.date).toDate()}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <TextInput
                      placeholder='Email'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name='email'
                      value={values.email}
                      error={errors.email}
                    />
                    <TextInput
                      placeholder='Name'
                      mt='md'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors.name}
                      name='name'
                    />
                    <Text size={'sm'} mt='sm' mb={'sm'}>
                      Select Time
                    </Text>
                    <ScrollArea
                      style={{
                        flex: 1,
                      }}
                      scrollbarSize={rem(10)}
                      pr={'md'}
                      type='always'
                    >
                      <div className={classes.timeslotWrapper}>
                        {TimeSlots.filter((val) => {
                          if (val === '3:00 PM') {
                            if (dayjs(values.date).day() === 5) {
                              return true;
                            }
                            return false;
                          }
                          return true;
                        }).map((time, index) => (
                          <TimeSlot
                            key={index}
                            text={time}
                            onClick={() => {
                              setFieldValue('time', time);
                            }}
                            selected={values.time === time}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                <button
                  type='reset'
                  style={{ display: 'none' }}
                  ref={resetRef}
                  onClick={() => resetForm()}
                />
              </form>
            )}
          </Formik>
        </div>
      </Center>
      <Group position='center'>
        <Button type='submit' form='appointmentForm'>
          Submit
        </Button>
        <Button
          variant='outline'
          type='reset'
          form='appointmentForm'
          onClick={() => resetRef.current?.click()}
        >
          Reset
        </Button>
      </Group>
    </div>
  );
};

export default Home;
