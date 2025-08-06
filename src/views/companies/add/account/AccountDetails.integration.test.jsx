import React from 'react';

import { useRouter } from 'next/navigation'; // Mock Next.js router

import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';

import AccountDetails from './AccountDetails'; // Assuming this is the correct path to the component that contains the form

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(), // Mock the push function
  })),
}));

// Mock the PackageDropdown component to simplify testing focus on AccountDetails
jest.mock('@/components/PackageDropdown', () => {
  return jest.fn(({ onChange, value }) => (
    <select data-testid="package-dropdown" value={value} onChange={e => onChange(e)}>
      <option value="">Select Package</option>
      <option value="pkg_valid">Valid Package</option>
      <option value="pkg_another">Another Valid Package</option>
    </select>
  ));
});


// Mock global.fetch
global.fetch = jest.fn();

// Mock companyUtils
jest.mock('@/utils/companyUtils', () => ({
  generateCompanyId: jest.fn(() => 'test-company-id-123'),
}));


describe('AccountDetails - Add Company Integration', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    mockRouterPush.mockClear();
    useRouter.mockImplementation(() => ({
      push: mockRouterPush,
    }));

    // Default mock for package dropdown (already handled by jest.mock above)
    // Ensure PackageDropdown mock is effective
  });

  const fillForm = (data = {}) => {
    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: data.companyName || 'Test Corp' } });
    fireEvent.change(screen.getByLabelText(/Company Email/i), { target: { value: data.companyEmail || 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Admin Name/i), { target: { value: data.adminName || 'Test Admin' } });
    fireEvent.change(screen.getByLabelText(/Admin Email/i), { target: { value: data.adminEmail || 'admin@example.com' } });
    
    // Add other required fields if necessary
  };

  test('successfully adds a company with a selected package', async () => {
    // Mock for POST /api/companies
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'comp_123', companyName: 'Test Corp', package: 'pkg_valid' }),
    });

    const onPackageChangeMock = jest.fn();
    
    render(<AccountDetails onPackageChange={onPackageChangeMock} />);

    fillForm();

    // Select a package using the mocked PackageDropdown
    fireEvent.change(screen.getByTestId('package-dropdown'), { target: { value: 'pkg_valid' } });
    expect(onPackageChangeMock).toHaveBeenCalledWith('pkg_valid');


    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/companies', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"package":"pkg_valid"'), // Ensure packageId is in the body
      }));
    });

    await waitFor(() => {
      // Check for alert message (window.alert is hard to test, consider a notification component)
      // For now, check for router push as a sign of success
      expect(mockRouterPush).toHaveBeenCalledWith('/companies');
    });
  });

  test('displays an error if adding a company with an invalid package ID (simulated client-side or API error)', async () => {
    // Scenario: API returns error for invalid package
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Invalid Package ID selected' }),
    });

    // Mock window.alert
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const onPackageChangeMock = jest.fn();
    
    render(<AccountDetails onPackageChange={onPackageChangeMock} />);

    fillForm();
    fireEvent.change(screen.getByTestId('package-dropdown'), { target: { value: 'pkg_invalid_at_api' } }); // Simulate selecting a package that API will reject
    expect(onPackageChangeMock).toHaveBeenCalledWith('pkg_invalid_at_api');

    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/companies', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"package":"pkg_invalid_at_api"'),
      }));
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(expect.stringContaining('Error creating company: Invalid Package ID selected'));
    });
    expect(mockRouterPush).not.toHaveBeenCalled();
    mockAlert.mockRestore();
  });

  test('successfully adds a company without selecting a package (if allowed)', async () => {
    // Mock for POST /api/companies (assuming package is optional)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'comp_456', companyName: 'Test Corp No Package', package: null }),
    });

    const onPackageChangeMock = jest.fn();
    
    render(<AccountDetails onPackageChange={onPackageChangeMock} />);

    fillForm({ companyName: 'Test Corp No Package' });
    
    // No package selected, so package-dropdown value remains ""

    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/companies', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"package":""'), // Or not containing "package" field at all, depending on API
      }));
    });

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/companies');
    });
  });

  // Add more tests:
  // - Required field validations (e.g., company name, email)
  // - Email format validation
  // - Other specific business logic related to company creation
});
