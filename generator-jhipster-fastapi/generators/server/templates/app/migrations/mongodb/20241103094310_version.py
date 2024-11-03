from mongo_migrate.base_migrate import BaseMigration


class Migration(BaseMigration):
    def upgrade(self):
        initial_notes = [
            {
                "subject": "First note",
                "description": "This is the first note"
            },
            {
                "subject": "Second note",
                "description": "This is the second note"
            }
        ]
        self.db['notes'].insert_many(initial_notes)
        
    def downgrade(self):
        self.db['notes'].delete_many({})
        
    def comment(self):
        return 'first migration with sample data for notes collection'
    