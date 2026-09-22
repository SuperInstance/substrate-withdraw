// substrate-withdraw: WITHDRAW opcode
// Pulls a previously-published observation into private scope.
// Creates a withdrawal scar - the audit trail of what was taken back.
// Note: this does not delete the observation; it adds the scar.

const { fnv1a64Hex } = require('@superinstance/observation-primitive');

function withdraw(observation, withDrawer, reason) {
  if (!observation?.id) throw new Error('withdraw requires observation with id');
  if (!withDrawer?.id && typeof withDrawer !== 'string') {
    throw new Error('withdraw requires withDrawer with id');
  }
  const withDrawerId = typeof withDrawer === 'string' ? withDrawer : withDrawer.id;
  const time = Date.now();

  return {
    type: 'withdrawal_scar',
    id: fnv1a64Hex(JSON.stringify({
      o: observation.id,
      w: withDrawerId,
      r: reason || null,
      t: time,
    })),
    withdraws: observation.id,
    withdrawer: withDrawerId,
    reason: reason || null,
    time,
    visibility: 'private', // scope reduction
    is_audit_trail: true, // the scar lives forever in witness log
  };
}

module.exports = { withdraw };
