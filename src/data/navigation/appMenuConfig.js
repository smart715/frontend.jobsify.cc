// React/Next/MUI imports may be needed if JSX is complex and uses them directly,
// but for now, assume these are passed as props to the ADMIN menu function.

// Helper function to create a menu item object (optional, but can keep definitions DRY)
const createMenuItem = (labelKey, icon, href, children = null) => ({
  labelKey, // This will be the key to look up in dictionary.navigation
  icon,
  href,
  ...(children && { children }),
})

// 1. Detailed definitions for all possible menu items that non-Admin roles might use.
// These definitions use 'labelKey' which corresponds to a key in dictionary.navigation.
export const detailedMenuDefinitions = {
  // Common items
  dashboard: createMenuItem(
    'dashboard',
    'ri-home-smile-line',
    '/dashboards/crm'
  ),
  messages: createMenuItem('messages', 'ri-wechat-line', '/apps/chat'),
  settings: createMenuItem('settings', 'ri-settings-3-line', '/admin/settings'),
  support: createMenuItem('support', 'ri-customer-service-2-line', '/support'),
  tickets: createMenuItem('tickets', 'ri-coupon-2-line', '/tickets'), // Assuming a generic /tickets for now

  // Super Admin specific items
  packages: createMenuItem('packages', 'ri-box-3-line', '/packages'),
  companies: createMenuItem('companies', 'ri-building-line', '/companies'),
  billing: createMenuItem('billing', 'ri-money-dollar-circle-line', '', [
    'invoiceList',
    'invoicePreview',
    'invoiceEdit',
    'invoiceAdd',
  ]),
  invoiceList: createMenuItem('list', 'ri-file-list-line', '/billing/list'),
  invoicePreview: createMenuItem(
    'preview',
    'ri-eye-line',
    '/billing/preview/4987'
  ),
  invoiceEdit: createMenuItem('edit', 'ri-pencil-line', '/billing/edit/4987'),
  invoiceAdd: createMenuItem('add', 'ri-add-circle-line', '/billing/add'),
  features: createMenuItem('features', 'ri-star-line', '/features'),
  modules: createMenuItem('modules', 'ri-grid-line', '/modules'),

  // Admin specific items (already listed in the JSX, but good to have definitions if any overlap)
  // This section might be less critical if ADMIN menu is pure JSX and doesn't use this map.
  // However, for consistency or potential future use, some common Admin items can be here.
  myCalendarAdmin: createMenuItem(
    'myCalendar',
    'ri-calendar-line',
    '/apps/calendar'
  ), // Note: key is myCalendar
  leads: createMenuItem('leads', 'ri-user-add-line', '/leads'),
  clientsAdmin: createMenuItem('clients', 'ri-team-line', '/clients'), // Note: key is clients
  hr: createMenuItem('hr', 'ri-briefcase-4-line', '/hr'),
  work: createMenuItem('work', 'ri-tools-line', '/work'),
  finance: createMenuItem('finance', 'ri-bank-line', '/finance'),
  ordersAdmin: createMenuItem('orders', 'ri-archive-2-line', '/orders'), // Note: key is orders
  events: createMenuItem('events', 'ri-calendar-event-line', '/events'),
  reportsAdmin: createMenuItem('reports', 'ri-bar-chart-line', '/reports'), // Note: key is reports

  // Supplier specific items
  myOrders: createMenuItem('myOrders', 'ri-list-check', '/my-orders'),
  inventory: createMenuItem('inventory', 'ri-archive-stack-line', '/inventory'),
  invoicesSupplier: createMenuItem(
    'invoices',
    'ri-bill-line',
    '/apps/invoice/list'
  ), // Note: key is invoices
  paymentHistory: createMenuItem(
    'paymentHistory',
    'ri-history-line',
    '/payment-history'
  ),

  // Employee specific items
  mySchedule: createMenuItem(
    'mySchedule',
    'ri-calendar-schedule-line',
    '/my-schedule'
  ),
  tasks: createMenuItem('tasks', 'ri-task-line', '/tasks'),
  timeClock: createMenuItem('timeClock', 'ri-time-line', '/time-clock'),
  leaveRequests: createMenuItem(
    'leaveRequests',
    'ri-calendar-close-line',
    '/leave-requests'
  ),
  performance: createMenuItem(
    'performance',
    'ri-line-chart-line',
    '/performance'
  ),
  announcements: createMenuItem(
    'announcements',
    'ri-megaphone-line',
    '/announcements'
  ),

  // Staff specific items
  myCalendarStaff: createMenuItem(
    'myCalendar',
    'ri-calendar-line',
    '/apps/calendar'
  ), // Note: key is myCalendar
  taskManagement: createMenuItem(
    'taskManagement',
    'ri-file-list-3-line',
    '/task-management'
  ),
  clientsStaff: createMenuItem('clients', 'ri-team-line', '/clients'), // Note: key is clients
  attendance: createMenuItem(
    'attendance',
    'ri-user-follow-line',
    '/attendance'
  ),
  shiftLogs: createMenuItem('shiftLogs', 'ri-file-text-line', '/shift-logs'),
  reportsStaff: createMenuItem('reports', 'ri-bar-chart-line', '/reports'), // Note: key is reports

  // Super Admin management (Super Admin specific)
  superAdmin: createMenuItem(
    'superAdmin',
    'ri-shield-user-line',
    '/super-admin'
  ),

  // To Do List (Super Admin specific)
  todoList: createMenuItem('todoList', 'ri-task-line', '/todos'),

  // E-commerce items (Super Admin specific)
  eCommerce: createMenuItem('eCommerce', 'ri-shopping-bag-3-line', '', [
    'ecommerceDashboard',
    'products',
    'orders',
    'customers',
    'analytics',
    'storefront',
    'themes',
    'ecommerceSettings',
  ]),
  ecommerceDashboard: createMenuItem('dashboard', 'ri-dashboard-2-line', '/ecommerce/dashboard'),
  products: createMenuItem('products', 'ri-box-3-line', '', [
    'productList',
    'productAdd',
    'categories',
  ]),
  productList: createMenuItem('list', 'ri-file-list-line', '/ecommerce/products/list'),
  productAdd: createMenuItem('add', 'ri-add-circle-line', '/ecommerce/products/add'),
  categories: createMenuItem('categories', 'ri-folder-line', '/ecommerce/categories'),
  orders: createMenuItem('orders', 'ri-shopping-cart-line', '', [
    'orderList',
    'orderDetails',
  ]),
  orderList: createMenuItem('list', 'ri-file-list-line', '/ecommerce/orders/list'),
  orderDetails: createMenuItem('details', 'ri-file-text-line', '/ecommerce/orders/details'),
  customers: createMenuItem('customers', 'ri-user-3-line', '/ecommerce/customers'),
  analytics: createMenuItem('analytics', 'ri-bar-chart-line', '/ecommerce/analytics'),
  storefront: createMenuItem('storefront', 'ri-store-2-line', '/ecommerce/storefront'),
  themes: createMenuItem('themes', 'ri-palette-line', '/ecommerce/themes'),
  ecommerceSettings: createMenuItem('settings', 'ri-settings-3-line', '/ecommerce/settings'),
}

// 2. Configuration object as per user's latest feedback
export const appMenuConfig = {
  // Admin users get access to their company's features (including impersonated admins)
  ADMIN: (props) => {
    const {
      locale,
      dictionary,
      verticalNavOptions,
      theme,
      Menu,
      SubMenu,
      MenuItem,
      MenuSection,
      RenderExpandIcon,
      menuItemStyles,
      menuSectionStyles,
      transitionDuration,
      session,
    } = props

    // The JSX provided by the user:
    return (
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{ icon: <i className="ri-circle-fill" /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem
          href={`/${locale}/launchpad`}
          icon={<i className="ri-dashboard-2-line" />}
          exactMatch={true}
        >
          {dictionary['navigation'].launchpad}
        </MenuItem>
        {/* Ensure session is available if this check is kept, or remove if role is already confirmed */}
        {/* {session?.user?.role === 'ADMIN' && ( */}
        <MenuItem
          href={`/${locale}/admin/dashboard`}
          icon={<i className="ri-shield-user-line" />}
          exactMatch={true}
        >
          {dictionary['navigation']?.adminPanel || 'Admin Panel'}
        </MenuItem>
        {/* )} */}
        <MenuItem
          href={`/${locale}/dashboards/dashboard`}
          icon={<i className="ri-home-smile-line" />}
          exactMatch={true}
        >
          {dictionary['navigation'].dashboards}
        </MenuItem>
        <SubMenu
          label={dictionary['navigation'].calendar}
          icon={<i className="ri-calendar-line" />}
        >
          <MenuItem href={`/${locale}/dashboards/calendar`} exactMatch={true}>
            {dictionary['navigation'].calendar}
          </MenuItem>
        </SubMenu>
        <SubMenu
          label={dictionary['navigation'].appointments}
          icon={<i className="ri-inbox-line" />}
        >
          <MenuItem
            href={`/${locale}/dashboards/appointments`}
            exactMatch={false}
            activeUrl={`/${locale}/dashboards/appointments`}
          >
            {dictionary['navigation'].appointments}
          </MenuItem>
        </SubMenu>
        <MenuItem
          href={`/${locale}/clients`}
          icon={<i className="ri-user-3-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/clients`}
        >
          {dictionary['navigation'].customers}
        </MenuItem>
        <MenuItem
          href={`/${locale}/leads`}
          icon={<i className="ri-user-star-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/leads`}
        >
          {dictionary['navigation'].leads}
        </MenuItem>
        <SubMenu
          label={dictionary['navigation'].hr || 'HR'}
          icon={<i className="ri-user-settings-line" />}
        >
          <MenuItem
            href={`/${locale}/employees`}
            exactMatch={false}
            activeUrl={`/${locale}/employees`}
          >
            {dictionary['navigation'].employees}
          </MenuItem>
          <MenuItem
            href={`/${locale}/hr/leaves`}
            exactMatch={false}
            activeUrl={`/${locale}/hr/leave`}
          >
            {dictionary['navigation'].leave || 'Leave'}
          </MenuItem>
          <MenuItem
            href={`/${locale}/hr/shift-roster`}
            exactMatch={false}
            activeUrl={`/${locale}/hr/shift-roster`}
          >
            {dictionary['navigation'].shiftRoster || 'Shift Roster'}
          </MenuItem>
          <MenuItem
            href={`/${locale}/hr/attendance`}
            exactMatch={false}
            activeUrl={`/${locale}/hr/attendance`}
          >
            {dictionary['navigation'].attendance || 'Attendance'}
          </MenuItem>
          <MenuItem
            href={`/${locale}/hr/holiday`}
            exactMatch={false}
            activeUrl={`/${locale}/hr/holiday`}
          >
            {dictionary['navigation'].holiday || 'Holiday'}
          </MenuItem>
          <MenuItem
            href={`/${locale}/hr/designation`}
            exactMatch={false}
            activeUrl={`/${locale}/hr/designation`}
          >
            {dictionary['navigation'].designation || 'Designation'}
          </MenuItem>
          <MenuItem
            href={`/${locale}/hr/department`}
            exactMatch={false}
            activeUrl={`/${locale}/hr/department`}
          >
            {dictionary['navigation'].department || 'Department'}
          </MenuItem>
          <MenuItem
            href={`/${locale}/hr/appreciation`}
            exactMatch={false}
            activeUrl={`/${locale}/hr/appreciation`}
          >
            {dictionary['navigation'].appreciation || 'Appreciation'}
          </MenuItem>
        </SubMenu>
        <MenuItem
          href={`/${locale}/invoices`}
          icon={<i className="ri-file-text-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/invoices`}
        >
          {dictionary['navigation'].invoices}
        </MenuItem>
        <SubMenu
          label={dictionary['navigation'].orders}
          icon={<i className="ri-archive-2-line" />}
        >
          <MenuItem
            href={`/${locale}/dashboards/orders`}
            exactMatch={false}
            activeUrl={`/${locale}/dashboards/orders`}
          >
            {dictionary['navigation'].orders}
          </MenuItem>
        </SubMenu>
        <MenuItem
          href={`/${locale}/reports`}
          icon={<i className="ri-bar-chart-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/reports`}
        >
          {dictionary['navigation'].reports}
        </MenuItem>
        <SubMenu
          label={dictionary['navigation'].eCommerce}
          icon={<i className="ri-shopping-bag-3-line" />}
        >
          <MenuItem
            href={`/${locale}/ecommerce/dashboard`}
            icon={<i className="ri-dashboard-2-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/dashboard`}
          >
            {dictionary['navigation'].dashboard}
          </MenuItem>
          
          <SubMenu
            label={dictionary['navigation'].products}
            icon={<i className="ri-box-3-line" />}
          >
            <MenuItem
              href={`/${locale}/ecommerce/products/list`}
              exactMatch={false}
              activeUrl={`/${locale}/ecommerce/products/list`}
            >
              {dictionary['navigation'].list}
            </MenuItem>
            <MenuItem
              href={`/${locale}/ecommerce/products/add`}
              exactMatch={false}
              activeUrl={`/${locale}/ecommerce/products/add`}
            >
              {dictionary['navigation'].add}
            </MenuItem>
            <MenuItem
              href={`/${locale}/ecommerce/categories`}
              exactMatch={false}
              activeUrl={`/${locale}/ecommerce/categories`}
            >
              {dictionary['navigation'].categories}
            </MenuItem>
          </SubMenu>
          
          <SubMenu
            label={dictionary['navigation'].orders}
            icon={<i className="ri-shopping-cart-line" />}
          >
            <MenuItem
              href={`/${locale}/ecommerce/orders/list`}
              exactMatch={false}
              activeUrl={`/${locale}/ecommerce/orders/list`}
            >
              {dictionary['navigation'].list}
            </MenuItem>
            <MenuItem
              href={`/${locale}/ecommerce/orders/details`}
              exactMatch={false}
              activeUrl={`/${locale}/ecommerce/orders/details`}
            >
              {dictionary['navigation'].details}
            </MenuItem>
          </SubMenu>
          
          <MenuItem
            href={`/${locale}/ecommerce/customers`}
            icon={<i className="ri-user-3-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/customers`}
          >
            {dictionary['navigation'].customers}
          </MenuItem>
          
          <MenuItem
            href={`/${locale}/ecommerce/analytics`}
            icon={<i className="ri-bar-chart-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/analytics`}
          >
            {dictionary['navigation'].analytics}
          </MenuItem>
          
          <MenuItem
            href={`/${locale}/ecommerce/storefront`}
            icon={<i className="ri-store-2-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/storefront`}
          >
            {dictionary['navigation'].storefront}
          </MenuItem>
          
          <MenuItem
            href={`/${locale}/ecommerce/themes`}
            icon={<i className="ri-palette-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/themes`}
          >
            {dictionary['navigation'].customize}
          </MenuItem>
          
          <MenuItem
            href={`/${locale}/ecommerce/settings`}
            icon={<i className="ri-settings-3-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/settings`}
          >
            {dictionary['navigation'].settings}
          </MenuItem>
        </SubMenu>
        
        <SubMenu
          label={dictionary['navigation'].payments}
          icon={<i className="ri-bank-card-2-line" />}
        >
          <MenuItem
            href={`/${locale}/apps/invoice/list`}
            exactMatch={false}
            activeUrl={`/${locale}/apps/invoice/list`}
          >
            {dictionary['navigation'].list}
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/invoice/preview/4987`}
            exactMatch={false}
            activeUrl={`/${locale}/apps/invoice/preview`}
          >
            {dictionary['navigation'].preview}
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/invoice/edit/4987`}
            exactMatch={false}
            activeUrl={`/${locale}/apps/invoice/edit`}
          >
            {dictionary['navigation'].edit}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/invoice/add`} exactMatch={true}>
            {dictionary['navigation'].add}
          </MenuItem>
        </SubMenu>

        <MenuSection label={dictionary['navigation'].resources}>
          <SubMenu
            label={dictionary['navigation'].services}
            icon={<i className="ri-file-4-line" />}
          >
            <MenuItem
              href={`/${locale}/resources/services`}
              exactMatch={false}
              activeUrl={`/${locale}/resources/services`}
            >
              {dictionary['navigation'].services}
            </MenuItem>
            <MenuItem
              href={`/${locale}/dashboards/services/detail-services`}
              exactMatch={false}
              activeUrl={`/${locale}/dashboards/services/detail-services`}
            >
              {dictionary['navigation'].detailServices}
            </MenuItem>
          </SubMenu>
          <MenuItem
            href={`/${locale}/apps/academy/daily-assignments`}
            icon={<i className="ri-user-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/apps/academy/daily-assignments`}
          >
            {dictionary['navigation'].agents}
          </MenuItem>
          <SubMenu
            label={dictionary['navigation'].locations}
            icon={<i className="ri-map-pin-line" />}
          >
            <MenuItem
              href={`/${locale}/resources/locations`}
              exactMatch={false}
              activeUrl={`/${locale}/resources/locations`}
            >
              {dictionary['navigation'].locations}
            </MenuItem>
          </SubMenu>
          <MenuItem
            href={`/${locale}/apps/kanban`}
            icon={<i className="ri-drag-drop-line" />}
            exactMatch={true}
          >
            {dictionary['navigation'].kanban}
          </MenuItem>
          <MenuItem
            href={`/${locale}/resources/coupons`}
            icon={<i className="ri-coupon-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/resources/coupons`}
          >
            {dictionary['navigation'].coupons}
          </MenuItem>
        </MenuSection>
        <MenuSection label={dictionary['navigation'].settings}>
          <SubMenu
            label={dictionary['navigation'].settings}
            icon={<i className="ri-settings-3-line" />}
          >
            <MenuItem
              href={`/${locale}/settings/business`}
              exactMatch={false}
              activeUrl={`/${locale}/settings/business`}
            >
              {dictionary['navigation'].business}
            </MenuItem>
            <MenuItem
              href={`/${locale}/dashboards/settings/detailing-services`}
              exactMatch={false}
              activeUrl={`/${locale}/dashboards/settings/detailing-services`}
            >
              {dictionary['navigation'].detailingServices}
            </MenuItem>
          </SubMenu>
          <SubMenu
            label={dictionary['navigation'].automation}
            icon={<i className="ri-calendar-line" />}
          >
            <MenuItem
              href={`/${locale}/settings/automation`}
              exactMatch={false}
              activeUrl={`/${locale}/settings/automation`}
            >
              {dictionary['navigation'].automation}
            </MenuItem>
          </SubMenu>
          <SubMenu
            label={dictionary['navigation'].rolesPermissions}
            icon={<i className="ri-lock-2-line" />}
          >
            <MenuItem
              href={`/${locale}/apps/roles`}
              exactMatch={false}
              activeUrl={`/${locale}/apps/roles`}
            >
              {dictionary['navigation'].roles}
            </MenuItem>
            <MenuItem
              href={`/${locale}/apps/permissions`}
              exactMatch={false}
              activeUrl={`/${locale}/apps/permissions`}
            >
              {dictionary['navigation'].permissions}
            </MenuItem>
          </SubMenu>
          <SubMenu
            label={dictionary['navigation'].formFields}
            icon={<i className="ri-folder-transfer-line" />}
          >
            <MenuItem
              href={`/${locale}/settings/formFields`}
              exactMatch={false}
              activeUrl={`/${locale}/settings/formFields`}
            >
              {dictionary['navigation'].formFields}
            </MenuItem>
          </SubMenu>
        </MenuSection>
        <MenuSection label={dictionary['navigation'].dailydevotion}>
          <MenuItem
            href={`/${locale}/dashboards/daily-devotion`}
            icon={<i className="ri-settings-3-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/dashboards/daily-devotion`}
          >
            {dictionary['navigation'].dailydevotion}
          </MenuItem>
        </MenuSection>
      </Menu>
    )
  },

  // Super Admin gets a function like ADMIN role
  SUPER_ADMIN: (props) => {
    const {
      locale,
      dictionary,
      verticalNavOptions,
      theme,
      Menu,
      SubMenu,
      MenuItem,
      MenuSection,
      RenderExpandIcon,
      menuItemStyles,
      menuSectionStyles,
      transitionDuration,
    } = props

    return (
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{ icon: <i className="ri-circle-fill" /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem
          href={`/${locale}/dashboards/crm`}
          icon={<i className="ri-home-smile-line" />}
          exactMatch={true}
        >
          {dictionary['navigation'].dashboard}
        </MenuItem>
        <MenuItem
          href={`/${locale}/packages`}
          icon={<i className="ri-box-3-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/packages`}
        >
          {dictionary['navigation'].packages}
        </MenuItem>
        <MenuItem
          href={`/${locale}/features`}
          icon={<i className="ri-star-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/features`}
        >
          {dictionary['navigation'].features}
        </MenuItem>
        <MenuItem
          href={`/${locale}/modules`}
          icon={<i className="ri-grid-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/modules`}
        >
          {dictionary['navigation'].modules}
        </MenuItem>
        <MenuItem
          href={`/${locale}/companies`}
          icon={<i className="ri-building-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/companies`}
        >
          {dictionary['navigation'].companies}
        </MenuItem>
        <MenuItem
          href={`/${locale}/billing/list`}
          icon={<i className="ri-money-dollar-circle-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/billing/list`}
        >
          {dictionary['navigation'].billing}
        </MenuItem>
        <MenuItem
          href={`/${locale}/support`}
          icon={<i className="ri-customer-service-2-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/support`}
        >
          {dictionary['navigation'].support}
        </MenuItem>
        <SubMenu
          label={dictionary['navigation'].eCommerce || 'E-Commerce'}
          icon={<i className="ri-shopping-bag-3-line" />}
        >
          <MenuItem
            href={`/${locale}/ecommerce/dashboard`}
            icon={<i className="ri-dashboard-2-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/dashboard`}
          >
            {dictionary['navigation'].dashboard}
          </MenuItem>
          
          <SubMenu
            label={dictionary['navigation'].products || 'Products'}
            icon={<i className="ri-box-3-line" />}
          >
            <MenuItem
              href={`/${locale}/ecommerce/products/list`}
              exactMatch={false}
              activeUrl={`/${locale}/ecommerce/products/list`}
            >
              {dictionary['navigation'].list || 'List'}
            </MenuItem>
            <MenuItem
              href={`/${locale}/ecommerce/products/add`}
              exactMatch={false}
              activeUrl={`/${locale}/ecommerce/products/add`}
            >
              {dictionary['navigation'].add || 'Add'}
            </MenuItem>
            <MenuItem
              href={`/${locale}/ecommerce/categories`}
              exactMatch={false}
              activeUrl={`/${locale}/ecommerce/categories`}
            >
              {dictionary['navigation'].categories || 'Categories'}
            </MenuItem>
          </SubMenu>
          
          <SubMenu
            label={dictionary['navigation'].orders || 'Orders'}
            icon={<i className="ri-shopping-cart-line" />}
          >
            <MenuItem
              href={`/${locale}/ecommerce/orders/list`}
              exactMatch={false}
              activeUrl={`/${locale}/ecommerce/orders/list`}
            >
              {dictionary['navigation'].list || 'List'}
            </MenuItem>
            <MenuItem
              href={`/${locale}/ecommerce/orders/details`}
              exactMatch={false}
              activeUrl={`/${locale}/ecommerce/orders/details`}
            >
              {dictionary['navigation'].details || 'Details'}
            </MenuItem>
          </SubMenu>
          
          <MenuItem
            href={`/${locale}/ecommerce/customers`}
            icon={<i className="ri-user-3-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/customers`}
          >
            {dictionary['navigation'].customers || 'Customers'}
          </MenuItem>
          
          <MenuItem
            href={`/${locale}/ecommerce/analytics`}
            icon={<i className="ri-bar-chart-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/analytics`}
          >
            {dictionary['navigation'].analytics || 'Analytics'}
          </MenuItem>
          
          <MenuItem
            href={`/${locale}/ecommerce/storefront`}
            icon={<i className="ri-store-2-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/storefront`}
          >
            {dictionary['navigation'].storefront || 'Storefront'}
          </MenuItem>
          
          <MenuItem
            href={`/${locale}/ecommerce/themes`}
            icon={<i className="ri-palette-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/themes`}
          >
            {dictionary['navigation'].customize || 'Customize'}
          </MenuItem>
          
          <MenuItem
            href={`/${locale}/ecommerce/settings`}
            icon={<i className="ri-settings-3-line" />}
            exactMatch={false}
            activeUrl={`/${locale}/ecommerce/settings`}
          >
            {dictionary['navigation'].settings || 'Settings'}
          </MenuItem>
        </SubMenu>
        <MenuItem
          href={`/${locale}/admin/settings`}
          icon={<i className="ri-settings-3-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/admin/settings`}
        >
          {dictionary['navigation'].settings}
        </MenuItem>
        <MenuItem
          href={`/${locale}/super-admin`}
          icon={<i className="ri-shield-user-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/super-admin`}
        >
          {dictionary['navigation'].superAdmin || 'Super Admin'}
        </MenuItem>
        <MenuItem
          href={`/${locale}/todos`}
          icon={<i className="ri-task-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/todos`}
        >
          {dictionary['navigation'].todoList}
        </MenuItem>
        <MenuItem
          href={`/${locale}/admin/faq`}
          icon={<i className="ri-question-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/admin/faq`}
        >
          {dictionary['navigation'].adminFaq || 'Admin FAQ'}
        </MenuItem>
        <MenuItem
          href={`/${locale}/staff-calendar`}
          icon={<i className="ri-calendar-schedule-line" />}
          exactMatch={false}
          activeUrl={`/${locale}/staff-calendar`}
        >
          {dictionary['navigation'].staffCalendar || 'Staff Calendar'}
        </MenuItem>
      </Menu>
    )
  },

  // For other roles, store the list of *label keys* (must match keys in detailedMenuDefinitions and dictionary)
  SUPER_ADMIN_LABELS: [
    'dashboard',
    'packages',
    'features',
    'modules',
    'companies',
    'billing',
    'support',
    'settings',
    'superAdmin',
    'todoList',
    'eCommerce',
  ],
  SUPPLIER_LABELS: [
    'dashboard',
    'myOrders',
    'inventory',
    'invoices',
    'paymentHistory',
    'tickets',
    'messages',
    'support',
    'settings',
  ],
  EMPLOYEE_LABELS: [
    'dashboard',
    'mySchedule',
    'tasks',
    'timeClock',
    'messages',
    'leaveRequests',
    'performance',
    'announcements',
    'support',
    'settings',
  ],
  STAFF_LABELS: [
    'dashboard',
    'myCalendar',
    'taskManagement',
    'clients',
    'attendance',
    'shiftLogs',
    'reports',
    'tickets',
    'messages',
    'support',
    'settings',
  ],
}

// Note: The actual JSX for ADMIN is embedded. This is unusual but directly reflects user feedback.
// The detailedMenuDefinitions provides the source of truth for constructing menus for other roles based on their label lists.
// Ensure all 'labelKey' in detailedMenuDefinitions and *_LABELS arrays correspond to valid keys in dictionary.navigation.
