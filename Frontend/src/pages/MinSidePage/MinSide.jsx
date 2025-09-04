import React, { useEffect, useState } from "react";
import "./MinSide.scss";
import GreenDivider from "../../components/GreenDivider/GreenDivider";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/Footer/FooterComponent";
import { useNavigate } from "react-router-dom";

// Dummy data til annoncer (indtil backend er klar)
const dummyAds = [
    {
        id: 1,
        title: "iPhone 12",
        price: "1899 kr",
        description: "Super fed mobiltelefon der fungerer perfekt og kommer med alt originalt tilbehør....",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80"
    }
];

export default function MinSide() {
    // Tabs og brugerdata state
    const [activeTab, setActiveTab] = useState("profil");
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        address: "",
        zipcode: "",
        phone: "",
        email: "",
        hasNewsletter: false,
        hasNotification: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const [userAds, setUserAds] = useState([]); // brugerens annoncer
    const navigate = useNavigate();

    // Funktion til at hente brugerens annoncer
    function fetchUserAds(userId) {
        fetch("http://localhost:4000/api/products")
            .then(res => res.json())
            .then(products => {
                // Debug: log produkterne for at se om userId er med
                console.log("Produkter fra backend:", products);
                // Hvis userId ikke findes, vis fejl
                if (!products.length || !products[0].hasOwnProperty("userId")) {
                    setError("Kan ikke vise dine annoncer. Backend returnerer ikke userId på produkter.");
                    setUserAds([]);
                    return;
                }
                setUserAds(products.filter(p => p.userId === userId));
            })
            .catch(() => setUserAds([]));
    }

    // Hent brugerdata fra localStorage og backend
    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!localUser.email) {
            setError("Du er ikke logget ind.");
            return;
        }
        fetch(`http://localhost:4000/api/users?email=${encodeURIComponent(localUser.email)}`)
            .then(res => res.json())
            .then(users => {
                const found = Array.isArray(users)
                    ? users.find(u => u.email === localUser.email)
                    : (users && users.email === localUser.email ? users : null);
                if (found && found.id) {
                    setUser({ ...found }); // gemmer bruger med id
                    fetch(`http://localhost:4000/api/users/${found.id}`)
                        .then(res => res.json())
                        .then(data => {
                            setForm({
                                firstname: data.firstname || "",
                                lastname: data.lastname || "",
                                address: data.address || "",
                                zipcode: data.zipcode ? String(data.zipcode) : "",
                                phone: data.phone || "",
                                email: data.email || "",
                                hasNewsletter: !!data.hasNewsletter,
                                hasNotification: !!data.hasNotification
                            });
                        })
                        .catch(() => setError("Kunne ikke hente brugerdata"));
                    // Hent annoncer for bruger
                    fetchUserAds(found.id);
                } else {
                    setError("Bruger ikke fundet");
                }
            })
            .catch(() => setError("Kunne ikke hente bruger"));
    }, []);

    // Hent annoncer igen når man skifter til "annoncer"-tab
    useEffect(() => {
        if (activeTab === "annoncer" && user?.id) {
            fetchUserAds(user.id);
        }
    }, [activeTab, user]);

    // Håndter input ændringer
    function handleChange(e) {
        const { id, value, type, checked } = e.target;
        setForm(f => ({
            ...f,
            [id]: type === "checkbox" ? checked : value
        }));
    }

    // Gem ændringer til profil
    async function handleSave(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!user?.id) return;
        if (!form.firstname || !form.lastname || !form.address || !form.zipcode || !form.email) {
            setError("Alle felter skal udfyldes");
            return;
        }
        if (!/^\d{4}$/.test(form.zipcode)) {
            setError("Postnummer skal være 4 cifre");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    zipcode: Number(form.zipcode)
                })
            });
            if (!res.ok) throw new Error();
            setSuccess("Ændringer gemt!");
        } catch {
            setError("Kunne ikke gemme ændringer");
        }
        setLoading(false);
    }

    // Slet profil
    async function handleDelete() {
        setDeleteError("");
        setDeleteSuccess("");
        if (!user?.id) return;
        try {
            const res = await fetch(`http://localhost:4000/api/users/${user.id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error();
            setDeleteSuccess("Profil slettet");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);
        } catch {
            setDeleteError("Kunne ikke slette profil");
        }
    }

    // Slet annonce
    async function handleDeleteAd(adId) {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`http://localhost:4000/api/products/${adId}`, {
                method: "DELETE",
                headers: {
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
                }
            });
            if (!res.ok) throw new Error();
            // Opdater listen efter sletning
            setUserAds(userAds.filter(ad => ad.id !== adId));
        } catch {
            setError("Kunne ikke slette annonce");
        }
    }

    // Gå til annonce
    function handleGoToAd(slug) {
        // Naviger til produkter-siden og send slug med via state
        navigate("/produkter", { state: { slug } });
    }

    // Skift tab
    function handleTab(tab) {
        setActiveTab(tab);
        setSuccess("");
        setError("");
    }

    return (
        <div id="myAccountPageContainer">
                            <HeaderComponent />

            <main id="myAccountPage">
                <GreenDivider />
                <div id="myAccountTabs">
                    <button
                        id="profilTab"
                        className={activeTab === "profil" ? "active" : ""}
                        onClick={() => handleTab("profil")}
                    >Min Profil</button>
                    <button
                        id="annoncerTab"
                        className={activeTab === "annoncer" ? "active" : ""}
                        onClick={() => handleTab("annoncer")}
                    >Mine Annoncer</button>
                </div>
                {activeTab === "profil" && (
                    <form id="myAccountForm" onSubmit={handleSave}>
                        <div id="myAccountFormGrid">
                            <div id="formColLeft">
                                <label htmlFor="firstname">Fornavn</label>
                                <input id="firstname" type="text" placeholder="Dit navn...." value={form.firstname} onChange={handleChange} />
                                <label htmlFor="lastname">Efternavn</label>
                                <input id="lastname" type="text" placeholder="Dit efternavn...." value={form.lastname} onChange={handleChange} />
                                <label htmlFor="address">Adresse</label>
                                <input id="address" type="text" placeholder="Din adresse...." value={form.address} onChange={handleChange} />
                                <label htmlFor="zipcode">Postnummer</label>
                                <input id="zipcode" type="text" placeholder="Dit postnummer....." value={form.zipcode} onChange={handleChange} maxLength={4} />
                                <label htmlFor="phone">Telefon</label>
                                <input id="phone" type="text" placeholder="Dit telefon nummer...." value={form.phone} onChange={handleChange} />
                                <label htmlFor="email">Email</label>
                                <input id="email" type="email" placeholder="Din email adresse...." value={form.email} onChange={handleChange} />
                            </div>
                            <div id="formColRight">
                                <div id="checkboxStack">
                                    <div id="checkboxRowNewsletter">
                                        <span>
                                            Jeg ønsker at modtage nyheder om klima-indsatsen, gode tilbud, eksklusive deals og lignende promoverings-mails fra den grønne avis og samarbejds-partnere?
                                        </span>
                                        <input type="checkbox" id="hasNewsletter" checked={form.hasNewsletter} onChange={handleChange} />
                                    </div>
                                    <div id="checkboxRowNotification">
                                        <span>
                                            Jeg ønsker at modtage notifikationer i form af emails når der sker en opdatering på en af mine annoncer eller jeg modtager en ny henvendelse?
                                        </span>
                                        <input type="checkbox" id="hasNotification" checked={form.hasNotification} onChange={handleChange} />
                                    </div>
                                </div>
                                <div id="myAccountBtnStack">
                                    <button type="button" id="deleteProfileBtn" onClick={handleDelete}>slet profil</button>
                                    <button type="submit" id="saveProfileBtn" disabled={loading}>gem ændringer</button>
                                </div>
                                {deleteError && <div id="myAccountErrorBanner">{deleteError}</div>}
                                {deleteSuccess && <div id="myAccountSuccessBanner">{deleteSuccess}</div>}
                            </div>
                        </div>
                        {error && <div id="myAccountErrorBanner">{error}</div>}
                        {success && <div id="myAccountSuccessBanner">{success}</div>}
                    </form>
                )}
                {activeTab === "annoncer" && (
                    <div id="mineAnnoncerContent">
                        {/* Viser brugerens annoncer */}
                        {userAds.length === 0 && (
                            <div>Du har ingen annoncer endnu.</div>
                        )}
                        {userAds.map(ad => (
                            <div id="adCard" key={ad.id}>
                                <div id="adCardHeader">
                                    <span id="adCardTitle">{ad.name}</span>
                                    <span id="adCardPrice">Pris: {ad.price} kr</span>
                                </div>
                                <div id="adCardBody">
                                    <div id="adCardDesc">{ad.description}</div>
                                    <img id="adCardImg" src={ad.image} alt={ad.name} />
                                </div>
                                <div id="adCardFooter">
                                    <button id="adCardGoToBtn" onClick={() => handleGoToAd(ad.slug)}>Gå til annonce</button>
                                    <button id="adCardDeleteBtn" onClick={() => handleDeleteAd(ad.id)}>Fjern annonce</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
                            <FooterComponent />

        </div>
    );
}