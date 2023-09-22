import LanguageDropdown from './components/language-dropdown';

const App: React.FunctionComponent = () => {
  return (
    <div className="App-container">
      <main className="Hero-section">
        <h1
          className="leading-snug tracking-tighter font-medium text-4xl"
          aria-description="Manage your skills"
          aria-label="Headline: Manage your skills"
          data-testid="page-headline"
        >
          {'Manage your skills'}
        </h1>
        <h3
          className="leading-snug tracking-tighter font-normal text-xl text-neutral-500"
          title="Add the languages you know"
          data-testid="page-description"
        >
          {'Add Languages you know'}
        </h3>
      </main>
      <div className="Language-dropdownComponentContainer my-12">
        <LanguageDropdown />
      </div>
    </div>
  );
};

export default App;
