export default async (db) => {
  try {
    // Drop table if exists
    await db.schema.dropTableIfExists('test');

    // Create a table
    await db.schema.createTable('test', (t) => {
      t.bigincrements('id');
      t.string('title');
    });

    // Insert some datas
    await db('test').insert({ title: 'foo' });
    await db('test').insert({ title: 'bar' });
    await db('test').insert({ title: 'baz' });

    // Events
    await db.schema.createTable('event', (t) => {
      t.increments('event_id');
      t.string('contract_address', 42);
      t.string('transaction_hash', 68);
      t.timestamp('created').defaultTo(db.fn.now());
      t.integer('log_index');
      t.integer('block_number');
      t.string('name');
      t.json('args');

      t.unique(['block_number', 'log_index']);
    });

    // Edit Streams
    await db.schema.createTable('edit_stream', (t) => {
      t.increments('edit_stream_id');
      t.timestamp('created').defaultTo(db.fn.now());
      t.timestamp('updated').defaultTo(null);
      t.string('lang', 2);
      t.string('title');

      t.unique('edit_stream_id');
    });

    // Proposals
    await db.schema.createTable('proposal_state', (t) => {
      t.increments('proposal_state_id');
      t.string('name');

      t.unique('proposal_state_id');
    });
    await db('proposal_state').insert({ proposal_state_id: 0, name: 'Draft' });
    await db('proposal_state').insert({ proposal_state_id: 1, name: 'In Review' });
    await db('proposal_state').insert({ proposal_state_id: 2, name: 'Rejected' });
    await db('proposal_state').insert({ proposal_state_id: 3, name: 'Accepted' });
    await db('proposal_state').insert({ proposal_state_id: 4, name: 'Expired' });
    await db('proposal_state').insert({ proposal_state_id: 5, name: 'Proposed' });

    await db.schema.createTable('proposal', (t) => {
      t.increments('proposal_id');
      t.integer('parent_id').references('proposal.proposal_id');
      t.integer('proposal_state_id').references('proposal_state.proposal_state_id');
      t.integer('edit_stream_id').references('edit_stream.edit_stream_id');
      t.boolean('dirty').defaultTo(false);
      t.timestamp('created').defaultTo(db.fn.now());
      t.timestamp('updated').defaultTo(null);
      t.string('from_address', 42);
      t.decimal('image_offset');
      t.string('content_hash', 68);
      t.string('lang', 2);
      t.uuid('doc_uuid');
      t.string('hero_hash');
      t.string('title');
      t.json('reference_map');
      t.json('additional_content');
      t.text('description');
      t.text('megadraft');

      t.unique('proposal_id');
    });

    // Votes
    await db.schema.createTable('vote', (t) => {
      t.increments('vote_id');
      t.integer('proposal_id').references('proposal.proposal_id');
      t.string('from_address', 42);
      t.timestamp('created').defaultTo(db.fn.now());
      t.timestamp('updated').defaultTo(null);
      t.string('survey_hash', 68);
      t.boolean('dirty').defaultTo(false);
      t.boolean('accepted');
      t.integer('acceptance');

      t.integer('overall');
      t.integer('standard');
      t.integer('comprehensive');
      t.integer('viewpoints');
      t.integer('accuracy');
      t.integer('sources');
      t.integer('thorough');
      t.json('checklist');
      t.text('notes');

      t.unique('vote_id');
    });

    // Tags
    await db.schema.createTable('tag', (t) => {
      t.increments('tag_id');
      t.boolean('active').defaultTo(false);
      t.string('name');

      t.unique('tag_id');
    });
    await db.schema.createTable('tag_proposal', (t) => {
      t.increments('tag_proposal_id');
      t.integer('tag_id').references('tag.tag_id');
      t.string('from_address', 42);
      
      t.unique('tag_proposal_id');
    });
    await db.schema.createTable('tag_edit_stream', (t) => {
      t.increments('tag_edit_stream_id');
      t.integer('tag_id').references('tag.tag_id');
      t.integer('edit_stream_id').references('edit_stream.edit_stream_id');
      
      t.unique('tag_edit_stream_id');
    });

    // Transactions (chain side)
    await db.schema.createTable('transaction_type', (t) => {
      t.string('transaction_type_id');
      t.string('name');
      
      t.unique('transaction_type_id');
    });

    await db('transaction_type').insert({ transaction_type_id: 'other', name: 'Other' });
    await db('transaction_type').insert({ transaction_type_id: 'vote', name: 'Vote' });
    await db('transaction_type').insert({ transaction_type_id: 'publish', name: 'Publish' });
    await db('transaction_type').insert({ transaction_type_id: 'transferEth', name: 'Transfer of Ether' });
    await db('transaction_type').insert({ transaction_type_id: 'transferLUN', name: 'Transfer of LUN' });
    await db('transaction_type').insert({ transaction_type_id: 'bid', name: 'Ad bid' });

    await db.schema.createTable('transaction_state', (t) => {
      t.string('transaction_state_id');
      t.string('name');
      
      t.unique('transaction_state_id');
    });
    await db('transaction_state').insert({ transaction_state_id: 0, name: 'Pending' });
    await db('transaction_state').insert({ transaction_state_id: 1, name: 'Complete' });
    await db('transaction_state').insert({ transaction_state_id: 2, name: 'Failed' });
    await db('transaction_state').insert({ transaction_state_id: 3, name: 'Dropped' });

    await db.schema.createTable('transaction', (t) => {
      t.string('hash', 68);
      t.string('nonce', 68);
      t.string('from_address', 42);
      t.string('to_address', 42);
      t.decimal('gas');
      t.decimal('gas_price');
      t.decimal('gas_used');
      t.timestamp('created').defaultTo(db.fn.now());
      t.timestamp('updated').defaultTo(null);
      t.integer('transaction_type_id').references('transaction_type.transaction_type_id');
      t.string('transaction_state_id').references('transaction_state.transaction_state_id');
      t.integer('block_number');
      t.integer('value');
      t.integer('status');
      t.text('data');
      
      t.unique('hash');
    });

    // Transaction watch (app side)
    await db.schema.createTable('watch', (t) => {
      t.string('hash', 68);
      t.string('transaction_state_id').references('transaction_state.transaction_state_id');
      t.boolean('read').defaultTo(false);
      t.integer('proposal_id').references('proposal.proposal_id');
      t.string('from_address', 42);
      t.timestamp('created').defaultTo(db.fn.now());
      t.timestamp('updated').defaultTo(null);
      t.string('type');
      t.string('title');
      t.string('signedtx');
      t.json('tx');
      
      t.unique('hash');
    });

    // Notifications
    await db.schema.createTable('notification', (t) => {
      t.increments('notification_id');
      t.string('hashed_address', 68);
      t.timestamp('created').defaultTo(db.fn.now());
      t.timestamp('updated').defaultTo(null);
      t.boolean('read').defaultTo(false);
      t.string('type');
      t.json('data');
      
      t.unique('notification_id');
    });

    // Drafts
    await db.schema.createTable('draft_state', (t) => {
      t.increments('draft_state_id');
      t.boolean('show').defaultTo(false);
      t.string('name');

      t.unique('draft_state_id');
    });
    await db('draft_state').insert({ draft_state_id: 0, show: true, name: 'Draft' });
    await db('draft_state').insert({ draft_state_id: 1, show: false, name: 'Submitted' });

    await db.schema.createTable('draft', (t) => {
      t.increments('draft_id');
      t.integer('parent_id').references('draft.draft_id');
      t.integer('draft_state_id').references('draft_state.draft_state_id').defaultTo(0);
      t.integer('edit_stream_id').references('edit_stream.edit_stream_id');
      t.integer('proposal_id').references('proposal.proposal_id');
      t.timestamp('created').defaultTo(db.fn.now());
      t.timestamp('updated').defaultTo(null);
      t.uuid('doc_uuid');
      t.decimal('image_offset');
      t.string('hero_hash', 68);
      t.string('title');
      t.json('reference_map');
      t.json('additional_content');
      t.text('description');
      t.text('megadraft');

      t.unique('draft_id');
    });

  } catch (error) {
    console.error(error);
  }
};
