import { T, Var } from 'gt-next';
import { LogoSpinner } from '../logo-spinner';

type Props = {
  firstName: string;
};

export function ChatEmpty({ firstName }: Props) {
  return (
    <div className="todesktop:mt-24 mt-[200px] flex w-full flex-col items-center justify-center text-center md:mt-24">
      <LogoSpinner />
      <span className="mt-6 text-xl font-medium">
        <T>
          Hi <Var>{firstName}</Var>, how can I help <br />
          you today?
        </T>
      </span>
    </div>
  );
}
