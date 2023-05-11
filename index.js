// import necessary libraries
import { ApiPromise, WsProvider } from '@polkadot/api';
import { WebClient } from '@slack/web-api';
import { load } from 'js-yaml'
import { readFileSync } from 'fs'

// define function to check the specified validator's intent
async function checkValidatorIntent(url, slackApiToken, slackChannel, validatorAddress) {
  try {
    // connect to Polkadot API
    const provider = new WsProvider(url);
    const api = await ApiPromise.create({ provider });

    // get the specified validator's intent
    const validator = await api.query.staking.validators(validatorAddress);
    const commission = validator.commission.toString()
    console.log(`Validator ${validatorAddress} has intent to validate with commission ${commission / Math.pow(10, 7)}%`)

    if (commission == '0') {
      console.log(`Validator ${validatorAddress} has no intent to validate!`)
      if (slackApiToken) {
        // send notification to Slack if the validator has no intent to validate
        const slackClient = new WebClient(slackApiToken);
        await slackClient.chat.postMessage({
            channel: slackChannel,
            text: `Validator ${validatorAddress} has no intent to validate!`,
        });
      }
    }

    // disconnect from Polkadot API
    await provider.disconnect();
  } catch (error) {
    console.error(error);
  }
}

function readConfig(path) {
    try {
        const yamlFile = readFileSync(path, "utf8")
        const loadedYaml = load(yamlFile)
        return loadedYaml
    } catch(error) {
        console.log(error.message)
        process.exit(1)
    }
}

async function main() {
    if (process.argv.length !== 3) {
        console.error('Expected one argument: Path to a yaml config file.');
        process.exit(1);
    }
    const config = readConfig(process.argv[2])

    config.validators[0]
    config.validators.forEach(validatorAddress => {
        checkValidatorIntent(config.url, config.slackApiToken, config.slackChannel, validatorAddress);
    });
}

main();