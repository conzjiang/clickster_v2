desc 'Transfer image_urls to S3'

task transfer_images: :environment do
  puts 'Transferring image_urls to S3...'

  [User, TvShow].each do |model|
    model.where.not(image_url: nil).each do |obj|
      name = obj.try(:username) || obj.try(:title)
      puts "Copying over #{obj.class} #{name}'s image"

      begin
        obj.update!(image: obj.image_url)
      rescue Paperclip::AdapterRegistry::NoHandlerError
        next
      end
    end
  end
end