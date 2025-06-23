import { LoginForm } from "../../components/login/Form";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center pt-8 pr-20 pl-8 bg-white max-md:px-5">
      <img
        src="logo.png"
        alt="Logo"
        onClick={() => (window.location.href = "/")}
        className="object-contain self-start w-16 aspect-square"
      />

      <section className="w-full max-w-[1097px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-[59%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow text-6xl text-teal-900 whitespace-nowrap">
              <h2 className="font-buthick text-teal mb-[0px] mt-[35px]">
                Influencehub
              </h2>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0b37f84d22a36bafd11d0255050d7f1adb8a06b4?placeholderIfAbsent=true&apiKey=87394bd0cd7a4add8bf680009e12faa5"
                alt="Influencehub illustration"
                className="object-contain self-end max-w-full  w-[351px] max-md:mt-10"
              />
            </div>
          </div>
          <div className="ml-5 w-[41%] max-md:ml-0 max-md:w-full">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
