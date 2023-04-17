import { useToggle, upperFirst } from '@mantine/hooks';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  type PaperProps,
  Button,
  Checkbox,
  Anchor,
  Stack,
  Center,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
    },
  });

  useEffect(() => {
    if (router.query.signup) {
      toggle('register');
    }
  }, [router.query, toggle]);

  return (
    <Center h='100%' mt='lg'>
      <Paper w={rem('26.25rem')} radius='md' p='xl' withBorder {...props}>
        <Text size='lg' weight={500} mb={'lg'}>
          Welcome , {type} with
        </Text>

        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.onSubmit(async () => {
            if (type === 'register') {
              const response = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({
                  ...form.values,
                }),
              });
              if (response.redirected) return router.push(response.url);
            } else {
              const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({
                  ...form.values,
                }),
              });
              if (response.redirected) return router.push('/appointments');
            }
          })}
        >
          <Stack>
            {type === 'register' && (
              <TextInput
                label='Name'
                placeholder='Your name'
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue('name', event.currentTarget.value)
                }
                radius='md'
              />
            )}

            <TextInput
              required
              label='Email'
              placeholder='hello@mantine.dev'
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue('email', event.currentTarget.value)
              }
              error={form.errors.email && 'Invalid email'}
              radius='md'
            />

            <PasswordInput
              required
              label='Password'
              placeholder='Your password'
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue('password', event.currentTarget.value)
              }
              error={
                form.errors.password &&
                'Password should include at least 6 characters'
              }
              radius='md'
            />

            {type === 'register' && (
              <Checkbox
                label='I accept terms and conditions'
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue('terms', event.currentTarget.checked)
                }
              />
            )}
          </Stack>

          <Group position='apart' mt='xl'>
            <Anchor
              component='button'
              type='button'
              color='dimmed'
              onClick={() => toggle()}
              size='xs'
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type='submit' radius='xl'>
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}
