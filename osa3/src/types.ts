// Customer types
export interface Customer {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  streetaddress: string;
  postcode: string;
  city: string;
  _links: {
    self: {
      href: string;
    };
    customer?: {
      href: string;
    };
  };
}

// Training types
export interface Training {
  date: string;
  activity: string;
  duration: number;
  customer?: Customer | null;
  _links: {
    self: {
      href: string;
    };
    training?: {
      href: string;
    };
    customer?: {
      href: string;
    };
  };
}

// API Response types
export interface CustomersResponse {
  _embedded: {
    customers: Customer[];
  };
}

export interface TrainingsResponse {
  _embedded: {
    trainings: Training[];
  };
}

// Snackbar types
export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

// Sort order type
export type SortOrder = 'asc' | 'desc';
