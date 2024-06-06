// ABI - Application binary interface. Each contract has its own ABI.
// We can get it after smart contract compilation.
import abi from './abi.json';
import { ethers } from 'ethers'
import hg, {Network, Environment} from '@hgraph.io/sdk';
import type { FormattedLog, GraphQLEventLogs } from './types.ts';


// we need a contract id for graqhql query
const contract_id = process.env.CONTRACT_ID || '4420050';
// we need a contract evm address for event parsing
const contract_evm = process.env.CONTRACT_EVM || '0xe04913457812bf84a3e2403616d0e68ba44e6eb9';

const main = async () => {
  const contract = new ethers.Contract(
    contract_evm,
    abi,
  );

  const hgClient = new hg({
    network: Network.HederaTestnet,
    token: process.env.HGRAPH_GRAPHQL_API_KEY,
    environment: Environment.Production,
  });

  // query logs with hgql
  // data - is a default emitted values.
  // topics (topic0, topic1...) contains indexed event data.
  const query = `
  query ContractEventLog($contract_id: bigint!, $limit: Int = 10) {
    logs: contract_log(
      where: {
        contract_id: {_eq: $contract_id}
      }
      order_by: {consensus_timestamp: desc}
      limit: $limit
    ) {
      data
      topic0
      topic1
      topic2
      topic3
    }
  }
  `;

  const gqlResponse = await hgClient.query<GraphQLEventLogs>({
    query,
    variables: {
      contract_id,
    },
  })

  // format logs to fit ethers logs structure
  const formattedLogs: FormattedLog[] = [];
  const formatHex = (value: string) => '0x' + value.slice(2).padStart(64, '0');

  gqlResponse.data?.logs?.forEach(log => {
    if (!log.data) return;

    const topics = [log.topic0, log.topic1, log.topic2, log.topic3]
      .filter(Boolean)
      .map(topic => formatHex(topic!));

    formattedLogs.push({
      data: formatHex(log.data),
      topics,
      address: contract_evm,
    });
  })

  // Decode logs
  formattedLogs.forEach(log => {
    try {
      const eventFragment = contract.interface.parseLog(log);

      if (eventFragment) {
        console.dir({
          eventName: eventFragment.name,
          args: eventFragment.args,
        });
      }
    } catch (error) {
      console.error('Error decoding log:', error);
    }
  });
}


main();
