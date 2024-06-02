import CreateAccountService from './account/account-creation.service';
import GetAccountService from './account/account-get.service';
import UpdateAccountBalanceService from './account/account-balance-update.service';
import TransferService from './transaction/transaction-transfer.service';

const services = [
  CreateAccountService,
  GetAccountService,
  UpdateAccountBalanceService,
  TransferService,
];

export {
  CreateAccountService,
  GetAccountService,
  UpdateAccountBalanceService,
  TransferService,
  services,
};
