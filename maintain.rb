require 'sqlite3'

#things that I want to change... add more columns etc
#aka things that have to loop over the whole DB editing it

db = SQLite3::Database.new( "housing.db" )

rows = db.execute("
	SELECT rowid,* FROM housing ORDER BY rowid ASC LIMIT 0, 50000
")

rows.each do |row|
	rowid = row[0]
	price = row[3]
	if price =~ /,/
		puts price
		price = price.gsub(/,/, "")
		puts price, rowid
		db.execute("UPDATE housing SET price = ? WHERE rowid = ?", [price, rowid])
	end
end