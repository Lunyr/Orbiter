const constants = require('../build/shared/constants');
const seed = require('../build/backend/seed').default;
const { ProposalState } = constants;

const ADDRESS1 = '0x4e3a20de4dc3baca80ace5e92e75c92d7fed40fa';
const ADDRESS2 = '0x4e3a20de4dc3baca80ace5e92e75c92d7fed40fb';
const HASH1 = '0xbad312c0d9bd66c92e55f63651124b368e735a57877fcbb2cfaca890cf66a89a';
const HASH2 = '0xbad312c0d9bd66c92e55f63651124b368e735a57877fcbb2cfaca890cf66a89b';
const UUID1 = '1b671a64-40d5-491e-99b0-da01ff1f3341';
const UUID2 = '1b671a64-40d5-491e-99b0-da01ff1f334a';

let CURR_VOTE_ID = 0;
let MOCKED_UP = false;

const mockUp = async (db) => {
  if (MOCKED_UP) return;

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
    for (let j=1; j<4; j++) {
      await db('vote').insert({
        vote_id: CURR_VOTE_ID,
        proposal_id: i,
        from_address: ADDRESS1,
        accepted: true,
        notes: "This is a test vote",
      });
      CURR_VOTE_ID += 1;
    }
  }

  // And 20 proposals in review
  for (let i=53; i<73; i++) {
    await db('edit_stream').insert({ edit_stream_id: i, title: `In Reviews v${i}`, lang: 'en' });
    await db('proposal').insert({
      proposal_id: i,
      proposal_state_id: ProposalState.IN_REVIEW,
      edit_stream_id: i,
      from_address: ADDRESS2,
      image_offset: 0.1,
      content_hash: HASH1,
      lang: 'en',
      doc_uuid: UUID1,
      hero_hash: HASH2,
      title: `In Reviews v${i}`,
      reference_map: '[]',
      additional_content: '[]',
      description: 'This is a bunch of test proposals',
      megadraft: null
    });
  }

  // Create some test data for search
  await db('edit_stream').insert({ edit_stream_id: 74, title: 'Prose', lang: 'en' });

  await db('proposal').insert({
    proposal_id: 74,
    proposal_state_id: ProposalState.ACCEPTED,
    edit_stream_id: 75,
    from_address: ADDRESS1,
    image_offset: 0.1,
    content_hash: HASH1,
    lang: 'en',
    doc_uuid: UUID1,
    hero_hash: HASH2,
    title: 'Prose',
    reference_map: '[]',
    additional_content: '[]',
    description: 'This is awful prose in a thing some weirdos might call an article',
    megadraft: null
  });

  // Add an active tag, inactive tag, and accompanying info
  await db('tag').insert({ active: true, name: 'first' });
  await db('tag_proposal').insert({ tag_id: 1, from_address: ADDRESS1 });
  await db('tag_proposal').insert({ tag_id: 1, from_address: ADDRESS2 });
  await db('tag_edit_stream').insert({ tag_id: 1, edit_stream_id: 1 });
  await db('tag').insert({ active: false, name: 'second' });
  await db('tag_proposal').insert({ tag_id: 2, from_address: ADDRESS1 });

  MOCKED_UP = true;
};

module.exports = {
  mockUp,
  ADDRESS1,
  ADDRESS2,
  HASH1,
  HASH2,
  UUID1,
  UUID2,
};