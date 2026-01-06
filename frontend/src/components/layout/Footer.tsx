export function Footer() {
  return (
    <div className='p-4 text-center text-xs text-slate-400'>
      © {new Date().getFullYear()} Expense Tracker
      <br />
      With ❤️ by{' '}
      <a
        href='https://www.linkedin.com/in/miguemartelo/'
        target='_blank'
        rel='noopener noreferrer'
        className='text-emerald-600 hover:text-emerald-700 hover:underline'
      >
        Migue Martelo
      </a>
    </div>
  );
}

