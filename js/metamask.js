/**
 * Autor: Swipe#7992
 * https://exposit.xyz/
 * 
 */

    const conectar = document.querySelector("#conectar")
    const pagar = document.querySelector("#pagar")
    const showAccount = document.querySelector('.showAccount');
    let priceToWei = '2c68af0bb140000';

    if (typeof window.ethereum !== 'undefined') {
        myAlert('<p>Metamask instalada!<p>', 'myalert-success');
    } else if (typeof window.ethereum == 'undefined'){

      myAlert('<p>Tem de ter Metamask instalada no seu browser!</p>', 'myalert-danger');
    }

    conectar.addEventListener('click', () => {
      requestPermissions();
    });

    async function requestPermissions() {
      ethereum
        .request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        })
        .then((permissions) => {
          const accountsPermission = permissions.find(
            (permission) => permission.parentCapability === 'eth_accounts'
          );
          if (accountsPermission) {

            getAccount()
            console.log('eth_accounts permission successfully requested!');
            myAlert('<p>Sua wallet conectada com sucesso!</p>', 'myalert-success');

            document.getElementById("conectar").hidden = true;
            document.getElementById("pagar").hidden = false;
          }
        })
        .catch((error) => {
          if (error.code === 4001) {
            console.log('Permissions needed to continue.');
            myAlert('<p>Permissão recusada...</p>', 'myalert-danger');
          } else if(error.code === -32002) {
            myAlert('<p>Já tem uma ação aberta para conectar a sua conta! </p>', 'myalert-warning');
          } else {
            console.error(error);
          }
        });
    }

    async function getAccount() {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log(accounts);
      account = accounts[0];
      const primeira = account.substring(0 , 6);
      const segunda = account.substring(account.length - 5);
      const junto = primeira + "..." + segunda;
      console.log(junto);

      document.getElementById("account").hidden = false;
      showAccount.innerHTML = junto;

    }

    async function exit() {
      if (account && account.length > 0) {
          account = 0;
          if(account == 0){
            window.location.reload();
          }
          console.log(account);
      }
    }

    pagar.addEventListener('click', () => {
     ethereum.request({
         method: 'eth_sendTransaction',
         params: [
             {
             from: account,
             to: 'SUA CARTEIRA PARA RECEBER ETH',
             value: priceToWei,
             gasPrice: '0x09184e72a000',
             gas: '0x2710',
             },
         ],
         })
         .then((txHash) => {
          if (txHash && txHash.length > 0){
            myAlert('<p>Pagamento Negado!</p>', 'Pagamento Feito com sucesso!');
          }
         })
         .catch((error) => {
           if(error.code == 4001){
            myAlert('<p>Pagamento Negado!</p>', 'myalert-danger');
           }
         });
    });

