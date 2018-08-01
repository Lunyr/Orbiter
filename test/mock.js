const constants = require('../build/shared/constants');
const seed = require('../build/backend/seed').default;
const { ProposalState } = constants;

const ADDRESS1 = '0x4e3a20de4dc3baca80ace5e92e75c92d7fed40fa';
const ADDRESS2 = '0x4e3a20de4dc3baca80ace5e92e75c92d7fed40fb';
const HASH1 = '0xbad312c0d9bd66c92e55f63651124b368e735a57877fcbb2cfaca890cf66a89a';
const HASH2 = '0xbad312c0d9bd66c92e55f63651124b368e735a57877fcbb2cfaca890cf66a89b';
const UUID1 = '1b671a64-40d5-491e-99b0-da01ff1f3341';

const mockUp = async (db) => {
  // Setup the original schema and basic data
  await seed(db);

  // Create some test data
  await db('edit_stream').insert({ edit_stream_id: 1, title: 'Test', lang: 'en' });

  await db('proposal').insert({
    proposal_id: 1,
    proposal_state_id: ProposalState.ACCEPTED,
    edit_stream_id: 1,
    from_address: ADDRESS1,
    image_offset: 0.1,
    content_hash: HASH1,
    lang: 'en',
    doc_uuid: UUID1,
    hero_hash: HASH2,
    title: 'Test',
    reference_map: '[]',
    additional_content: '[]',
    description: 'This is a test article',
    megadraft: null
  });

  // Make sure we have at least 50 articles to test pagination
  for (let i=2; i<52; i++) {
    await db('edit_stream').insert({ edit_stream_id: i, title: `Bunch v${i}`, lang: 'en' });
    await db('proposal').insert({
      proposal_id: i,
      proposal_state_id: ProposalState.ACCEPTED,
      edit_stream_id: i,
      from_address: ADDRESS1,
      image_offset: 0.1,
      content_hash: HASH1,
      lang: 'en',
      doc_uuid: UUID1,
      hero_hash: HASH2,
      title: `Bunch v${i}`,
      reference_map: '[]',
      additional_content: '[]',
      description: 'This is a bunch of test proposals in one stream',
      megadraft: null
    });
  }
};

module.exports = {
  mockUp,
  ADDRESS1,
  ADDRESS2,
  HASH1,
  HASH2,
  UUID1,
};