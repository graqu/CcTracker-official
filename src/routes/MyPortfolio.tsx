import { CoinGeckoContext } from '@/store/CoinsDataStore';
import { useContext, useState } from 'react';
import { DataTable } from '@/components/cryptocurrencies/DataTable';
import { Columns } from '@/components/favourites/FavColumns';
import { Card } from '@/components/ui/card';
import styles from './MyPortfolio.module.css';
import { Button, buttonVariants } from '@/components/ui/button';
import { FavColumnRowType } from '@/lib/types';
import { ButtonContentInputT } from '@/lib/types';
import { favouritesStateType } from '@/lib/types';
import { ColumnsSkeleton } from '@/components/ui/ColumnsSkeleton';
import { skeletonData } from '@/lib/SkeletonTableData';

const PortfolioPage = () => {
  const context = useContext(CoinGeckoContext);
  const listOfFavourites = [...context.favouritesList.coinsList];
  const dataToStore = JSON.stringify({ ...context.favouritesList });
  const [refreshingData, setRefreshingData] = useState(false);
  const [uploadedUserData, setUploadedUserData] = useState<{
    stage: string;
    data: favouritesStateType;
  }>({
    stage: '',
    data: { coinsList: [], totalAmount: 0 },
  });

  const preparedList: FavColumnRowType[] = [...listOfFavourites];

  preparedList.map((favCoin) => {
    favCoin.amountChanger = context.onFavChangeAmount;
    favCoin.onRemove = context.onFavRemove;
  });

  let content;

  if (refreshingData) {
    content = <DataTable columns={ColumnsSkeleton} data={skeletonData} />;
  }
  if (!listOfFavourites && !refreshingData) {
    content = <p>There are no data</p>;
  }
  if (listOfFavourites && listOfFavourites.length === 0 && !refreshingData) {
    content = <p>No coins here</p>;
  }
  if (listOfFavourites && listOfFavourites.length > 0 && !refreshingData) {
    content = <DataTable columns={Columns} data={preparedList} />;
  }

  let uploadButtonContent: ButtonContentInputT = {
    style: 'outline',
    text: 'Import data',
    disabled: false,
  };

  if (uploadedUserData.stage === '') {
    uploadButtonContent = {
      style: 'outline',
      text: 'Import data',
      disabled: false,
    };
  } else if (uploadedUserData.stage === 'IMPORT') {
    uploadButtonContent = {
      style: 'default',
      text: 'Import other file',
      disabled: false,
    };
  } else if (uploadedUserData.stage === 'LOADING') {
    uploadButtonContent = {
      style: 'secondary',
      text: 'Please wait...',
      disabled: true,
    };
  }
  async function saveUserData() {
    // create a new handle
    const newHandle = await window.showSaveFilePicker({
      suggestedName: 'CcTracker_data',
      types: [
        {
          description: 'JSON File',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    const dataToSave = new Blob([dataToStore], {
      type: 'application/json',
    });

    // write our file
    await writableStream.write(dataToSave);

    // close the file and write the contents to disk.
    await writableStream.close();
  }

  const importUserData = (e) => {
    readData(e.target.files[0]);
  };

  function readData(file) {
    let data = {};

    if (file && file.type && !file.type.startsWith('application/json')) {
      alert('Not correct file format.', file.type);
      return;
    } else if (!file) {
      console.warn('operation cancelled - no file detected.');
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('loadstart', () => {
      console.log('loading');
      setUploadedUserData((prev) => {
        return { ...prev, stage: 'LOADING' };
      });
    });
    reader.addEventListener('load', (event) => {
      data = JSON.parse(event.target.result);
      console.log(reader.readyState);

      if (
        typeof data === 'object' &&
        Array.isArray(data.coinsList) &&
        !isNaN(data.totalAmount)
      ) {
        console.log('correct format');

        setTimeout(() => {
          setUploadedUserData((prev) => {
            return { ...prev, stage: 'IMPORT', data: data };
          });
        }, 500);
      } else {
        console.warn('incorrrect format of data');
      }
    });
    reader.addEventListener('error', () => {
      console.warn('Cannot load data - something went wrong');
    });
    reader.addEventListener('abort', () => {
      console.warn('import canceled');
      return;
    });
    reader.readAsText(file);
  }

  const cancelUserData = () => {
    const dialogue = confirm('Are You Sure ?');

    if (dialogue) {
      setUploadedUserData((prevState) => {
        return { ...prevState, stage: '', data: {} };
      });
    } else {
      return;
    }
  };

  const setUsersNewData = () => {
    context.onReset();
    setRefreshingData(true);
    setTimeout(() => {
      setRefreshingData(false);
      uploadedUserData.data.coinsList.forEach((coin) =>
        context.onFavAdd(coin.id, coin.amount),
      );
      context.onAmountUpdate();
    }, 500);
    setUploadedUserData((prevState) => {
      return { ...prevState, stage: '', data: {} };
    });
  };

  return (
    <>
      <Card className="my-[20px] p-[16px] relative">
        <h1 className="text-center my-[16px] font-bold">
          Your holdings total amount:
        </h1>
        <p className="text-center my-[16px]">
          ${context.favouritesList.totalAmount.toFixed(2)}
        </p>
        <div className="md:absolute top-3 right-3 flex flex-col">
          <Button className={`cursor-pointer mb-[6px]`} onClick={saveUserData}>
            Download data
          </Button>
          <label
            htmlFor="file-selector"
            className={`${styles['file-input']} ${buttonVariants({
              variant: uploadButtonContent?.style,
            })} cursor-pointer`}
          >
            <input
              type="file"
              className={`cursor-pointer`}
              id="file-selector"
              placeholder="import saved status"
              onClick={() => {
                alert(
                  'Remember. Only json files in format of data prepared by CcTracker App will work properly',
                );
              }}
              onChange={importUserData}
              accept=".json, .txt"
              multiple={false}
            />
            {uploadButtonContent?.text}
          </label>
        </div>
      </Card>

      {uploadedUserData.stage === 'IMPORT' && (
        <>
          <Card className="my-[20px] p-[16px]">
            <h2 className="text-lg font-bold">Uploaded data previev</h2>
            <p className="italic font-light text-sm">
              All you need to check is list of coins names and their amount.
              Rest of data like prices and full value, will be calculeted by
              CcTracker
            </p>
            <p>Check if everythink looks okay and confirm:</p>
            <div>
              <Button
                className={`cursor-pointer m-[10px]`}
                onClick={setUsersNewData}
              >
                confirm
              </Button>
              <Button
                variant={'destructive'}
                className={`cursor-pointer mb-[6px]`}
                onClick={cancelUserData}
              >
                cancel
              </Button>
            </div>
            <div className="text-left mx-auto max-w-[500px]">
              <ul>
                {uploadedUserData.data.coinsList.map((coin, index) => (
                  <li key={coin.id}>
                    {index + 1}. {coin.id},{' '}
                    <span className="font-bold">amount:</span> {coin.amount}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </>
      )}
      {content}
    </>
  );
};

export default PortfolioPage;
