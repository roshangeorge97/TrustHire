import screen1 from './static/Svg/screen1.jpg'
import screen2 from './static/Svg/screen2.jpg'
import screen3 from './static/Svg/screen3.jpg'


const callouts = [
    {
      name: 'Input your mail Id and your work(Github Repo) on the above form, and generate the link/QR Code!',
      description: '1. Genrate the QR Code',
      imageSrc: screen1,
      imageAlt: 'Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.',
      href: '#',
    },
    {
      name: 'Scan the QR code through your mobile, this would redirect you to the Reclaim Mobile App.',
      description: '2. Scan the QR code',
      imageSrc: screen2,
      imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
      href: '#',
    },
    {
      name: 'Click on add claim, to generate the unique link to share to your recruitors!',
      description: '3. Generate your Link!',
      imageSrc: screen3,
      imageAlt: 'Collection of four insulated travel bottles on wooden shelf.',
      href: '#',
    },
  ]
  
  export default function Usage() {
    return (
      <div className="bg-yellow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-8 sm:py-8 lg:max-w-none lg:py-8">
            <h2 className="text-5xl font-bold text-gray-900">How to Use?</h2>
            <p className='mt-6 font-semibold text-gray-900"'>Get your Link generated in 3 simple steps within minutes!</p>
  
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {callouts.map((callout) => (
                <div key={callout.name} className="group relative">
                    <p className="text-2xl font-semibold text-gray-900 p-4 pl-0">{callout.description}</p>
                  <div className="relative w-full overflow-hidden rounded-lg bg-white  group-hover:opacity-75 sm:h-128">
                    <img
                      src={callout.imageSrc}
                      className = "h-full w-full"
                    />
                  </div>
                  
                  <h3 className="mt-6 font-semibold text-gray-900">
                    <a href={callout.href}>
                      <span className="absolute inset-0" />
                      {callout.name}
                    </a>
                  </h3>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }