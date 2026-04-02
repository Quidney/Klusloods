import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstname">First Name</Label>
                                    <Input
                                        id="firstname"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="given-name"
                                        name="firstname"
                                        placeholder="First name"
                                    />
                                    <InputError message={errors.firstname} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastname">Last Name</Label>
                                    <Input
                                        id="lastname"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        autoComplete="family-name"
                                        name="lastname"
                                        placeholder="Last name"
                                    />
                                    <InputError message={errors.lastname} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid grid-cols-[2fr_1fr] gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="street">Street</Label>
                                    <Input
                                        id="street"
                                        type="text"
                                        required
                                        tabIndex={4}
                                        autoComplete="street-address"
                                        name="street"
                                        placeholder="Street"
                                    />
                                    <InputError message={errors.street} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="housenumber">House No</Label>
                                    <Input
                                        id="housenumber"
                                        type="text"
                                        required
                                        tabIndex={5}
                                        name="housenumber"
                                        placeholder="12A"
                                    />
                                    <InputError message={errors.housenumber} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="place_of_residence">City</Label>
                                    <Input
                                        id="place_of_residence"
                                        type="text"
                                        required
                                        tabIndex={6}
                                        autoComplete="address-level2"
                                        name="place_of_residence"
                                        placeholder="City"
                                    />
                                    <InputError message={errors.place_of_residence} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="postalcode">Post Code</Label>
                                    <Input
                                        id="postalcode"
                                        type="text"
                                        required
                                        tabIndex={7}
                                        autoComplete="postal-code"
                                        name="postalcode"
                                        placeholder="1234 AB"
                                    />
                                    <InputError message={errors.postalcode} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={8}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={9}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={10}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
